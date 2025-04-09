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
 * Include Import Settings Page
 */
require_once plugin_dir_path( __FILE__ ) . 'admin/import-settings.php';

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
	register_taxonomy( "a_to_z_category", [ "a_to_z" ], $args );
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


/**
 * Custom REST API Endpoints
 */
function get_a_to_z_posts_by_letter($request) {
    global $wpdb;
    $letters = range('A', 'Z');
    $post_type = 'a_to_z';

    $limit = intval($request->get_param('limit'));
    if ($limit <= 0) {
        $limit = 5;
    }

    $search = sanitize_text_field($request->get_param('search'));
    $results = [];

    if (!empty($search)) {
        $like = '%' . $wpdb->esc_like($search) . '%';
        $search_posts = $wpdb->get_results($wpdb->prepare("
            SELECT ID, post_title 
            FROM $wpdb->posts 
            WHERE post_status = 'publish' 
            AND post_type = %s 
            AND (post_title LIKE %s OR post_content LIKE %s)
            ORDER BY post_title ASC
        ", $post_type, $like, $like));

        $grouped_posts = [];

        foreach ($search_posts as $post) {
            $first_char = strtoupper(mb_substr($post->post_title, 0, 1));
            $group_key = in_array($first_char, $letters) ? $first_char : '#';

            if (!isset($grouped_posts[$group_key])) {
                $grouped_posts[$group_key] = [];
            }

            $a_to_z_url = get_field('a-to-z-url', $post->ID);
            $categories = wp_get_post_terms($post->ID, 'a_to_z_category', ['fields' => 'names']);

            $grouped_posts[$group_key][] = [
                'ID'         => $post->ID,
                'title'      => html_entity_decode($post->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                'url'        => $a_to_z_url ?: '',
                'categories' => $categories ?: [],
            ];
        }

        foreach ($letters as $letter) {
            if (!empty($grouped_posts[$letter])) {
                $results[] = [
                    'letter' => $letter,
                    'posts'  => array_slice($grouped_posts[$letter], 0, $limit),
                ];
            }
        }

        if (!empty($grouped_posts['#'])) {
            $results[] = [
                'letter' => '#',
                'posts'  => array_slice($grouped_posts['#'], 0, $limit),
            ];
        }

        return rest_ensure_response($results);
    }

    // === NON-SEARCH: A-Z and Non-Alpha ===

    // Non-alpha group
    $non_alpha_posts = $wpdb->get_results($wpdb->prepare("
        SELECT ID, post_title 
        FROM $wpdb->posts 
        WHERE post_status = 'publish' 
        AND post_type = %s 
        AND post_title REGEXP '^[^A-Za-z]' 
        ORDER BY post_title ASC 
        LIMIT %d
    ", $post_type, $limit));

    $non_alpha_formatted = [];

    foreach ($non_alpha_posts as $post) {
        $a_to_z_url = get_field('a-to-z-url', $post->ID);
        $categories = wp_get_post_terms($post->ID, 'a_to_z_category', ['fields' => 'names']);

        $non_alpha_formatted[] = [
            'ID'         => $post->ID,
            'title'      => html_entity_decode($post->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8'),
            'url'        => $a_to_z_url ?: '',
            'categories' => $categories ?: [],
        ];
    }

    if (!empty($non_alpha_formatted)) {
        $results[] = [
            'letter' => '#',
            'posts'  => $non_alpha_formatted,
        ];
    }

    // A–Z loop
    foreach ($letters as $letter) {
        $posts = $wpdb->get_results($wpdb->prepare("
            SELECT ID, post_title 
            FROM $wpdb->posts 
            WHERE post_status = 'publish' 
            AND post_type = %s 
            AND post_title LIKE %s 
            ORDER BY post_title ASC 
            LIMIT %d
        ", $post_type, $letter . '%', $limit));

        $formatted_posts = [];

        foreach ($posts as $post) {
            $a_to_z_url = get_field('a-to-z-url', $post->ID);
            $categories = wp_get_post_terms($post->ID, 'a_to_z_category', ['fields' => 'names']);

            $formatted_posts[] = [
                'ID'         => $post->ID,
                'title'      => html_entity_decode($post->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                'url'        => $a_to_z_url ?: '',
                'categories' => $categories ?: [],
            ];
        }

        if (!empty($formatted_posts)) {
            $results[] = [
                'letter' => $letter,
                'posts'  => $formatted_posts,
            ];
        }
    }

    return rest_ensure_response($results);
}

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/a-to-z-posts/', [
        'methods' => 'GET',
        'callback' => 'get_a_to_z_posts_by_letter',
        'permission_callback' => '__return_true'
    ]);
});