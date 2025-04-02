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


function utk_a_to_z_register_cpts() {

	/**
	 * Post Type: A to Z
	 */

	$labels = [
		"name" => __( "A to Z", "utk-a-to-z" ),
		"singular_name" => __( "A to Z", "utk-a-to-z" ),
	];

	$args = [
		"label" => __( "A to Z", "utk-a-to-z" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => false,
		"show_ui" => true,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"rest_namespace" => "wp/v2",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"delete_with_user" => false,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"can_export" => false,
		"rewrite" => [ "slug" => "a_to_z", "with_front" => true ],
		"query_var" => false,
		"menu_icon" => "dashicons-menu",
		"supports" => [ "title", "editor", "thumbnail" ],
		"show_in_graphql" => true,
		"graphql_single_name" => "A to Z",
		"graphql_plural_name" => "A to Z",
	];

	register_post_type( "a_to_z", $args );
}
add_action( 'init', 'utk_a_to_z_register_cpts' );

function utk_a_to_z_register_taxes() {

	/**
	 * Taxonomy: A to Z Categories
	 */

	$labels = [
		"name" => __( "A to Z Categories", "utk-a-to-z" ),
		"singular_name" => __( "A to Z Category", "utk-a-to-z" ),
	];

	$args = [
		"label" => __( "A to Z Categories", "utk-a-to-z" ),
		"labels" => $labels,
		"public" => false,
		"publicly_queryable" => false,
		"has_archive" => false,
		"hierarchical" => false,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => false,
		"rewrite" => [ 'slug' => 'a_to_z_category', 'with_front' => true, ],
		"show_admin_column" => true,
		"show_in_rest" => true,
		"show_tagcloud" => false,
		"rest_base" => "a_to_z_category",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"rest_namespace" => "wp/v2",
		"show_in_quick_edit" => false,
		"sort" => false,
		"show_in_graphql" => true,
		"graphql_single_name" => "Category",
		"graphql_plural_name" => "Category",
	];
	register_taxonomy( "category", [ "a_to_z" ], $args );
}
add_action( 'init', 'utk_a_to_z_register_taxes' );

// Ensure ACF is loaded before registering fields
add_action('acf/init', function() {
    if( function_exists('acf_add_local_field_group') ) {
		
		// Add URL field to A to Z posts
        acf_add_local_field_group(array(
            'key' => 'group_67ed7b9d6ba87',
            'title' => 'A to Z Details',
            'fields' => array(
                array(
                    'key' => 'field_67ed7b9d6ba89',
                    'label' => 'URL',
                    'name' => 'a-to-z-url',
                    'type' => 'url',
                    'instructions' => '',
                    'required' => 0,
                    'conditional_logic' => 0,
                    'wrapper' => array(
                        'width' => '',
                        'class' => '',
                        'id' => '',
                    ),
                    'show_in_graphql' => 1,
                    'default_value' => '',
                    'placeholder' => '',
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'a_to_z',
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => '',
            'active' => true,
            'description' => '',
            'show_in_rest' => 1,
            'show_in_graphql' => 1,
            'graphql_field_name' => 'aToZDetailsFields',
        ));
    }
});
