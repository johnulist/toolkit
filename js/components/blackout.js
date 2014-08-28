define([
    'jquery',
    './component'
], function($, Toolkit) {

Toolkit.Blackout = Toolkit.Component.extend({
    name: 'Blackout',
    version: '1.4.0',

    /** How many times the blackout has been opened while being opened. */
    count: 0,

    /** The loader animation element. */
    loader: null,

    /** The message element. */
    message: null,

    /**
     * Create the blackout and loader elements.
     *
     * @param {Object} [options]
     */
    constructor: function(options) {
        this.options = options = this.setOptions(options);
        this.element = this.createElement();

        // Generate loader elements
        this.loader = $(options.loaderTemplate);
        this.message = this.loader.find('[data-loader-message]');

        if (options.showLoading) {
            this.message.html(Toolkit.messages.loading);
        }

        // Initialize
        this.initialize();
    },

    /**
     * Hide the blackout if count reaches 0.
     */
    hide: function() {
        this.fireEvent('hiding');

        var count = this.count - 1;

        if (count <= 0) {
            this.count = 0;
            this.element.conceal();
            this.hideLoader();
        } else {
            this.count = count;
        }

        this.fireEvent('hidden', [(count <= 0)]);
    },

    /**
     * Hide the loader.
     */
    hideLoader: function() {
        this.loader.conceal();
    },

    /**
     * Show the blackout and increase open count.
     */
    show: function() {
        this.fireEvent('showing');

        var show = false;

        this.count++;

        if (this.count === 1) {
            this.element.reveal();
            show = true;
        }

        this.showLoader();

        this.fireEvent('shown', [show]);
    },

    /**
     * Show the loader.
     */
    showLoader: function() {
        this.loader.reveal();
    }

}, {
    showLoading: true,
    template: '<div class="blackout"></div>',
    templateFrom: '#toolkit-blackout-1',
    loaderTemplate: '<div class="loader bar-wave">' +
        '<span></span><span></span><span></span><span></span><span></span>' +
        '<div class="loader-message" data-loader-message></div>' +
    '</div>'
});

/** Has the blackout been created already? */
var blackout = null;

/**
 * Only one instance of Blackout should exist,
 * so provide a factory method that stores the instance.
 *
 * @param {Object} [options]
 * @returns {Toolkit.Blackout}
 */
Toolkit.Blackout.instance = function(options) {
    if (blackout) {
        return blackout;
    }

    return blackout = new Toolkit.Blackout(options);
};

return Toolkit;
});