/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import * as dom from 'libs/dom';
import * as obj from 'libs/object';
import delegate from 'libs/event';

export default class Plugin {
    constructor(selector, options = {}) {
        this.initialize(selector, options);
        this.enable();
        this.startup();
    }

    /**
     * Loop through the event bindings and attach events to the specified selector in the correct context.
     * Take into account window, document, and delegation.
     *
     * @param {string} type
     */
    bindEvents(type) {
        let event,
            context,
            callback,
            selector,
            method = (type === 'on') ? 'addEventListener' : 'removeEventListener';

        this.binds.forEach(bind => {
            event = bind[0];
            context = bind[1];
            selector = bind[2];
            callback = bind[3];

            // Determine the correct context
            if (context === 'window') {
                context = window;
            } else if (context === 'document') {
                context = document;
            } else {
                context = this[context];
            }

            // Delegated events
            if (selector) {
                context[method](event, delegate(selector, callback));

            // Regular events
            } else {
                context[method](event, callback);
            }
        });
    }

    /**
     * Destroy the plugin by unbinding events, removing elements, and deleting the instance.
     * The custom `shutdown()` method should be called first so that sub-classes can clean up.
     */
    destroy() {
        this.emit('destroying');
        this.shutdown();
        this.disable();
        this.unmount();
        this.emit('destroyed');
    }

    /**
     * Disable the plugin and unbind any events.
     */
    disable() {
        if (this.enabled) {
            this.bindEvents('off');
        }

        this.enabled = false;
    }

    /**
     * Emit an event and notify all listeners, as well as print debug information
     * if enabled. If a primary element is set, also trigger a DOM event.
     *
     * @param {string} event
     * @param {array} [args]
     */
    emit(event, args = []) {
        let debug = this.options.debug || Toolkit.debug,
            element = this.element,
            listeners = this.listeners[event];

        // Log debug information
        if (debug) {
            console.log(this.name + '#' + this.constructor.uid, new Date().getMilliseconds(), event, args);

            if (debug === 'verbose') {
                console.dir(this);
            }
        }

        // Notify plugin listeners
        if (listeners) {
            listeners.forEach(listener => listener.apply(this, args));
        }

        // Notify DOM listeners
        // IE<=9 do not support CustomEvent
        if (element && window.CustomEvent) {
            element.dispatchEvent(new CustomEvent(event + '.toolkit.' + this.getAttributeName(), {
                detail: {
                    context: this,
                    arguments: args
                }
            }));
        }
    }

    /**
     * Enable the plugin and bind any events.
     */
    enable() {
        if (!this.enabled) {
            this.bindEvents('on');
        }

        this.enabled = true;
    }

    /**
     * Return the plugin name as an HTML attribute compatible name.
     *
     * @returns {string}
     */
    getAttributeName() {
        return this.name.charAt(0).toLowerCase() + this.name.slice(1);
    }

    /**
     * Return the static options defined on the class declaration.
     *
     * @returns {object}
     */
    getDefaultOptions() {
        return this.constructor.options;
    }

    /**
     * Handles the initialization of the plugin by setting up members in the
     * correct order: options -> element(s) -> properties -> event bindings.
     *
     * The order is important as methods will require members from
     * the previous method to be initialized. This order *should not* change.
     *
     * @param {string} selector
     * @param {object} options
     */
    initialize(selector, options = {}) {
        this.constructor.uid += 1; // Increase UID
        this.selector = selector; // Save selector

        this.initOptions(options);
        this.initElement(selector);
        this.initProperties();
        this.initBinds();
        this.emit('init');
    }

    /**
     * Initialize the customizable options by inheriting options from the
     * parent, the static options from the current class, and
     * finally merging with a custom set of options passed as an argument.
     *
     * @param {object} options
     */
    initOptions(options = {}) {
        this.options = obj.merge({}, super.getDefaultOptions() || {}, this.getDefaultOptions());
        this.setOptions(options);
    }

    /**
     * Initialize the primary element(s) by attempting to find it in the DOM
     * using the selector passed from the constructor.
     *
     * This method should be overridden for elements that are rendered
     * from templates.
     *
     * @param {string} selector
     */
    initElement(selector) {
        this.setElement(dom.id(selector));
    }

    /**
     * Initialize the class properties by setting to defaults that should be
     * usable by sub-classes. The following properties are set.
     *
     *      name {string}       Name of the plugin. Should match the `Toolkit.Name` declaration.
     *      version {string}    Current or last modified version of the plugin.
     *      binds {array}       Mapping of DOM event bindings.
     *      cache {object}      Cached AJAX requests or data.
     *      listeners {object}  Event listeners to emit.
     *      enabled {bool}      Whether or not the plugin is enabled (events are bound).
     */
    initProperties() {
        this.name = 'Plugin';
        this.version = '3.0.0';
        this.binds = [];
        this.cache = {};
        this.listeners = {};
        this.enabled = false;
    }

    /**
     * Initialize the DOM event bindings. By default, this sets no binds,
     * as binds should be unique per sub-class.
     */
    initBinds() {
    }

    /**
     * Mount (insert) the primary element into the DOM.
     */
    mount() {
        var element = this.element;

        if (this.mounted || !element || dom.contains(element)) {
            return;
        }

        this.emit('mounting');

        dom.body.appendChild(element);

        this.emit('mounted');

        this.mounted = true;
    }

    /**
     * Subscribe to an event using a defined callback function.
     * The callback can either be a function or an array of functions.
     *
     * @param {string} event
     * @param {array|function} callbacks
     */
    on(event, callbacks) {
        if (!Array.isArray(callbacks)) {
            callbacks = [callbacks];
        }

        callbacks.forEach(callback => {
            let list = this.listeners[event] || [];
                list.push(callback);

            this.listeners[event] = list;
        });
    }

    /**
     * Unsubscribe from an event in which the callback matches a defined listener.
     * If no callback is passed, unsubscribe all listeners.
     *
     * @param {string} event
     * @param {function} [callback]
     */
    off(event, callback) {
        if (!callback) {
            delete this.listeners[event];
            return;
        }

        let listeners = this.listeners[event];

        if (listeners) {
            listeners.forEach((listener, i) => {
                if (listener === callback) {
                    listeners = listeners.splice(i, 1);
                }
            });
        }
    }

    /**
     * Method to be called when the plugin is destroyed and or removed from the DOM.
     * This method should be implemented in sub-classes to clean up and reset any state.
     */
    shutdown() {
    }

    /**
     * Method to be called when the plugin is instantiated and needs to be bootstrapped.
     * This method should be implemented in sub-classes to set the initial state.
     */
    startup() {
    }

    /**
     * Set a mapping of DOM events to bind to the primary element. The function
     * can either be a string for a name of a method on the current plugin,
     * or a literal function.
     *
     * Bindings support the following formats:
     *
     *      EVENT CONTEXT[ DELEGATE]: FUNC
     *
     * The selector is optional and is used for delegation.
     *
     * @param {object} binds
     */
    setBinds(binds) {
        let bindings = [];

        Object.keys(binds).forEach(key => {
            let [event, context, selector] = key
                    .replace('{mode}', this.options.mode)
                    .replace('{selector}', this.selector)
                    .split(' ', 3),
                callback = binds[key];

            // Find and bind the function
            if (typeof callback === 'string') {
                callback = this[callback].bind(this);
            }

            // Alter custom event names
            if (event === 'ready') {
                event = 'DOMContentLoaded';
            }

            bindings.push([event, context, selector, callback]);
        });

        this.binds = bindings;
    }

    /**
     * Set the primary element to use within the plugin.
     *
     * @param {HTMLElement} element
     */
    setElement(element) {
        if (dom.isElement(element)) {
            this.element = element;
        }
    }

    /**
     * Set a collection of elements to use within the plugin.
     *
     * @param {array} elements
     */
    setElements(elements) {
        if (Array.isArray(elements)) {
            this.elements = elements; // We'll assume they are `HTMLElement`s
        }
    }

    /**
     * Set and customize the options on the class instance.
     * Should take into account the following steps when setting:
     *
     * - Merge with and inherit parent options
     * - Merge responsive options if the breakpoint matches
     * - Merge grouped options if the group matches
     *
     * @param {object} options
     */
    setOptions(options) {
        options = obj.merge(this.options, options);

        // Inherit options based on responsive media queries
        if (options.responsive && window.matchMedia) {
            Object.keys(options.responsive).forEach(key => {
                let respOptions = options.responsive[key];

                if (matchMedia(respOptions.breakpoint).matches) {
                    obj.merge(options, respOptions);
                }
            });
        }

        // Auto-subscribe listeners that start with `on`
        Object.keys(options).forEach(key => {
            if (key.match(/^on[A-Z]/)) {
                this.on(key.substr(2).toLowerCase(), options[key]);
                delete options[key];
            }
        });

        // TODO - option groups

        this.options = options;
    }

    /**
     * Unmount (remove) the primary element from the DOM.
     */
    unmount() {
        var element = this.element;

        if (!this.mounted || (element && !dom.contains(element))) {
            return;
        }

        this.emit('unmounting');

        element.parentNode.removeChild(element);

        this.emit('unmounted');

        this.mounted = false;
    }

}

Plugin.options = {
    cache: true,
    debug: false
};