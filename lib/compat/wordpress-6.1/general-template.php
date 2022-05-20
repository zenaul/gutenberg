<?php
/**
 * Temporary compatibility shims for the wp-includes/general-template.php file in WordPress Core.
 *
 * @package gutenberg
 */

/**
 * Disable comments feed link for block themes.
 *
 * When backported to Core this should can be part of the feed_links_extra() function.
 *
 * @param bool $show Whether to display the comments feed link.
 * @return bool
 */
function wp_disable_comments_feed_for_block_themes( $show ) {
	return wp_is_block_theme() ? false : $show;
}
add_filter( 'feed_links_show_comments_feed', 'wp_disable_comments_feed_for_block_themes' );
