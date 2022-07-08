<?php
/**
 * Temporary compatibility shims for features present in Gutenberg.
 *
 * @package gutenberg
 */

/**
 * Returns whether the quote v2 is enabled by the user.
 *
 * @return boolean
 */
function gutenberg_is_quote_v2_enabled() {
	return get_option( 'gutenberg-experiments' ) && array_key_exists( 'gutenberg-quote-v2', get_option( 'gutenberg-experiments' ) );
}

/**
 * Sets a global JS variable used to trigger the availability of the experimental blocks.
 */
function gutenberg_enable_experimental_blocks() {
	if ( get_option( 'gutenberg-experiments' ) && array_key_exists( 'gutenberg-list-v2', get_option( 'gutenberg-experiments' ) ) ) {
		wp_add_inline_script( 'wp-block-library', 'window.__experimentalEnableListBlockV2 = true', 'before' );
	}

	if ( gutenberg_is_quote_v2_enabled() ) {
		wp_add_inline_script( 'wp-block-library', 'window.__experimentalEnableQuoteBlockV2 = true', 'before' );
	}
}

add_action( 'admin_init', 'gutenberg_enable_experimental_blocks' );

function gutenberg_add_default_class_name_to_rendered_block_markup( $block_content, $parsed_block, $block ) {
	if ( ! $block_content ) {
		return $block_content;
	}

	if ( ! $block->block_type || $block->block_type->is_dynamic() ) {
		return $block_content;
	}

	$class_name_supports = _wp_array_get( $block->block_type->supports, array( 'className' ), false );
	if ( ! $class_name_supports ) {
		return $block_content;
	}

	return gutenberg_add_class_name_to_wrapping_tag(
		$block_content,
		wp_get_block_default_classname( $block->name )
	);
}

add_action( 'render_block', 'gutenberg_add_default_class_name_to_rendered_block_markup', 10, 3 );

function gutenberg_add_class_name_to_wrapping_tag( $block_content, $added_class_name ) {
	$matches = array();
	$pattern = '/
    ^(\s*)                               # Any leading whitespace.
    <(?<tag_name>
        [a-zA-Z0-9\-]+                   # The opening tag...
        (?=\s|>)                         # ...followed by a whitespace or >
                                         # ?= means a "lookahead"
    )
    (?<before_class>                     # Any attributes prior to "class"
        (?:                              # ?: is a "non-capturing group"
            (?!\sclass=")[^>]            # Match all characters until ">" except when
                                         # the next character sequence is \sclass="
                                         # ?! is a "negative lookahead"
        )*
    )
    (?:\s*class="(?<class_name>[^"]+)")? # The class attribute, if any
    (?<after_class>[^>]*?)               # The rest of the tag
    >                                    # The closing tag
/xm';

	preg_match(
		$pattern,
		$block_content,
		$matches
	);

	if ( empty( $matches ) ) {
		return $block_content;
	}

	// Parse the existing class names.
	$current_class_attribute = ! empty( $matches['class_name'] ) ? $matches['class_name'] : '';
	$current_class_names     = explode( ' ', $current_class_attribute );
	$current_class_names     = array_map( 'trim', $current_class_names );
	$current_class_names     = array_filter( $current_class_names );

	// If wp-block-heading is already included, there's no need to add it again.
	if ( in_array( $added_class_name, $current_class_names, true ) ) {
		return $block_content;
	}

	// Otherwise, let's add it to the class names.
	$current_class_names[] = $added_class_name;
	$new_class_attribute   = implode( ' ', $current_class_names );

	// Construct a new opening tag.
	$new_tag_parts = array(
		$matches['tag_name'],
		$matches['before_class'],
		'class="' . $new_class_attribute . '"',
		$matches['after_class'],
	);
	$new_tag_parts = array_map( 'trim', $new_tag_parts );
	$new_tag_parts = array_filter( $new_tag_parts );
	$new_tag       = '<' . implode( ' ', $new_tag_parts ) . '>';

	// Replace the old opening tag with the new one.
	$initial_whitespace = $matches[1];
	$old_tag_ends_at    = strlen( $matches[0] );

	return $initial_whitespace . $new_tag . substr( $block_content, $old_tag_ends_at );
}
