<?php
/**
 * Plugin Name:       A to Z
 * Plugin URI:        https://www.utk.edu
 * Description:       A plugin for managing and displaying the A to Z index
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            UT OCM
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       a-to-z
 *
 * @package AToZ
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function a_to_z_block_init() {
	register_block_type( __DIR__ . '/build/a-to-z' );
	
}
add_action( 'init', 'a_to_z_block_init' );
