<?php
/**
 * Render callback for the A to Z block.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package AToZ
 */

if ( ! function_exists( 'a_to_z_render_callback' ) ) {
	/**
	 * Outputs the A to Z container HTML.
	 *
	 * @return string HTML markup for the block.
	 */
	function a_to_z_render_callback() {
		return '<div class="a-to-z-container alignfull" id="alpha"></div>';
	}
}

// Output the rendered HTML.
echo wp_kses_post( a_to_z_render_callback() );
