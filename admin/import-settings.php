<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Set up Import setting page
 */

 function utk_a_to_z_import_menu() {
    add_submenu_page(
        'edit.php?post_type=a_to_z',
        'Import A to Z',
        'Import A to Z',
        'manage_options',
        'import-a-to-z',
        'utk_a_to_z_import_page'
    );
}
add_action('admin_menu', 'utk_a_to_z_import_menu');

function utk_a_to_z_import_page() {
    ?>
    <div class="wrap">
		<h1>Manage A to Z Items</h1>
        <h2>Import A to Z Items From CSV</h2>
        <form method="post" enctype="multipart/form-data">
            <input type="file" name="csv_file" accept=".csv" required>
            <button type="submit" name="import_csv" class="button button-primary">Import</button>
            <?php wp_nonce_field('import_a_to_z_nonce', 'import_a_to_z_nonce'); ?>
        </form>

        <h2>Delete A to Z Items</h2>
        <form method="post">
            <p><strong>Warning:</strong> This will permanently delete all A to Z items and cannot be undone.</p>
            <button type="submit" name="delete_all_a_to_z" class="button button-danger" onclick="return confirm('Are you sure? This will permanently delete all A to Z items!');">
                Delete All A to Z
            </button>
            <?php wp_nonce_field('delete_a_to_z_nonce', 'delete_a_to_z_nonce'); ?>
        </form>
    </div>
    <?php

    if (isset($_POST['import_csv']) && !empty($_FILES['csv_file']['tmp_name'])) {
        check_admin_referer('import_a_to_z_nonce', 'import_a_to_z_nonce');
        utk_a_to_z_process_csv($_FILES['csv_file']['tmp_name']);
    }

    if (isset($_POST['delete_all_a_to_z'])) {
        check_admin_referer('delete_a_to_z_nonce', 'delete_a_to_z_nonce');
        utk_a_to_z_delete_all();
    }
}

function utk_a_to_z_process_csv($file_path) {
    if (($handle = fopen($file_path, 'r')) !== FALSE) {
        fgetcsv($handle); // Skip header row
        while (($data = fgetcsv($handle)) !== FALSE) {
            if (count($data) < 4) {
                continue; // Skip invalid rows
            }

            $title = sanitize_text_field($data[0]);
            $url = esc_url($data[1]);
            $tags = !empty($data[2]) ? "<!-- wp:paragraph --><p>" . sanitize_text_field($data[2]) . "</p><!-- /wp:paragraph -->" : '';
            $categories = array_map('trim', explode(',', $data[3]));

            $post_id = wp_insert_post([
                'post_title'   => $title,
                'post_content' => $tags,
                'post_status'  => 'publish',
                'post_type'    => 'a_to_z'
            ]);

            if ($post_id && !is_wp_error($post_id)) {
                update_field('a-to-z-url', $url, $post_id);
                foreach ($categories as $category) {
                    wp_set_object_terms($post_id, $category, 'a_to_z_category', true);
                }
            }
        }
        fclose($handle);
        echo '<div class="updated notice"><p>Import successful!</p></div>';
    }
}

function utk_a_to_z_delete_all() {
    global $wpdb;

    // Delete all 'a_to_z' posts
    $query = new WP_Query([
        'post_type'      => 'a_to_z',
        'posts_per_page' => -1,
        'fields'         => 'ids',
    ]);

    if ($query->have_posts()) {
        foreach ($query->posts as $post_id) {
            wp_delete_post($post_id, true);
        }
    }

    // Get all terms in 'a_to_z_category' taxonomy
    $terms = get_terms([
        'taxonomy'   => 'a_to_z_category',
        'hide_empty' => false,
    ]);

    if (!empty($terms) && !is_wp_error($terms)) {
        foreach ($terms as $term) {
            // Only delete categories that have no associated posts
            if ($term->count == 0) {
                wp_delete_term($term->term_id, 'a_to_z_category');
            }
        }
    }

    echo '<div class="updated notice"><p>All A to Z items and empty categories have been deleted.</p></div>';
}
