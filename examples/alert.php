<?php
$classes = array(value('state'));

if (value('round')) {
    $classes[] = 'round';
}

$classes = implode(' ', $classes); ?>

<div class="alert <?php echo $classes; ?>">
    <button type="button" class="close"><span class="x">&times;</span></button>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="">Nunc nec leo dui, non consequat diam.</a> Curabitur id nulla et augue facilisis tempus quis ut nibh.
</div>

<div class="alert <?php echo $classes; ?>">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nec leo dui, non consequat diam. Curabitur id nulla et augue facilisis tempus quis ut nibh. Aenean ullamcorper consequat enim id fringilla. Vivamus accumsan, mauris quis dictum accumsan, nisl libero luctus mauris, a dictum ligula ante ut magna. Morbi massa tellus, aliquet ut fringilla euismod, aliquam tincidunt nisi. Duis suscipit tempor viverra. Cras pretium lorem a tellus consectetur eu rutrum felis scelerisque. Phasellus sed risus nec diam feugiat fermentum. Duis semper aliquam nibh sed porttitor.</p>
    <hr>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="">Nunc nec leo dui, non consequat diam.</a> Curabitur id nulla et augue facilisis tempus quis ut nibh. Aenean ullamcorper consequat enim id fringilla. Vivamus accumsan, mauris quis dictum accumsan, nisl libero luctus mauris, a dictum ligula ante ut magna. Morbi massa tellus, aliquet ut fringilla euismod, aliquam tincidunt nisi. Duis suscipit tempor viverra. Cras pretium lorem a tellus consectetur eu rutrum felis scelerisque. Phasellus sed risus nec diam feugiat fermentum. Duis semper aliquam nibh sed porttitor.</p>
</div>

<div class="alert <?php echo $classes; ?>">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="">Nunc nec leo dui, non consequat diam.</a> Curabitur id nulla et augue facilisis tempus quis ut nibh. Aenean ullamcorper consequat enim id fringilla. Vivamus accumsan, mauris quis dictum accumsan, nisl libero luctus mauris, a dictum ligula ante ut magna. Morbi massa tellus, aliquet ut fringilla euismod, aliquam tincidunt nisi. Duis suscipit tempor viverra. Cras pretium lorem a tellus consectetur eu rutrum felis scelerisque. Phasellus sed risus nec diam feugiat fermentum. Duis semper aliquam nibh sed porttitor.</p>
    <ul>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
    </ul>
</div>

<div class="alert <?php echo $classes; ?>">
    <h5 class="alert-title">Header Title</h5>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="">Nunc nec leo dui, non consequat diam.</a> Curabitur id nulla et augue facilisis tempus quis ut nibh. Aenean ullamcorper consequat enim id fringilla. Vivamus accumsan, mauris quis dictum accumsan, nisl libero luctus mauris, a dictum ligula ante ut magna. Morbi massa tellus, aliquet ut fringilla euismod, aliquam tincidunt nisi. Duis suscipit tempor viverra. Cras pretium lorem a tellus consectetur eu rutrum felis scelerisque. Phasellus sed risus nec diam feugiat fermentum. Duis semper aliquam nibh sed porttitor.</p>
</div>