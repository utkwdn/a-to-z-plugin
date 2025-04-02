<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

 if (!function_exists('a_to_z_render_callback')) {
    function a_to_z_render_callback() {
        return '<div class="a-to-z-container" id="alpha"></div>';
    }
}

// Output the rendered HTML
echo a_to_z_render_callback();
