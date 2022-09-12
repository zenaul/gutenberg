/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalHStack as HStack,
	__experimentalTruncate as Truncate,
} from '@wordpress/components';
import { forwardRef, useEffect } from '@wordpress/element';
import { Icon, lock } from '@wordpress/icons';
import { SPACE, ENTER } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';

import ListViewExpander from './expander';
import { useBlockLock } from '../block-lock';
import BlockOptionsRenameItem from './block-options-rename-item';

const SINGLE_CLICK = 1;

function ListViewBlockSelectButton(
	{
		className,
		onClick,
		onToggleExpanded,
		onDragStart,
		onDragEnd,
		draggable,
		labelEditingMode,
		toggleLabelEditingMode,
		supportsBlockNaming,
		blockTitle,
		clientId,
		blockInformation,
		tabIndex,
		onFocus,
	},
	ref
) {
	const { isLocked } = useBlockLock( clientId );

	// The `href` attribute triggers the browser's native HTML drag operations.
	// When the link is dragged, the element's outerHTML is set in DataTransfer object as text/html.
	// We need to clear any HTML drag data to prevent `pasteHandler` from firing
	// inside the `useOnBlockDrop` hook.
	const onDragStartHandler = ( event ) => {
		event.dataTransfer.clearData();
		onDragStart?.( event );
	};

	const onKeyDownHandler = ( event ) => {
		// Handle default mode.
		if ( event.keyCode === ENTER || event.keyCode === SPACE ) {
			onClick( event );
		}
	};

	useEffect( () => {
		if ( ! labelEditingMode ) {
			// Re-focus button element when existing edit mode.
			ref?.current?.focus();
		}
	}, [ labelEditingMode ] );

	return (
		<>
			<Button
				ref={ ref }
				className={ classnames(
					'block-editor-list-view-block-node',
					'block-editor-list-view-block-select-button',
					className
				) }
				onClick={ ( event ) => {
					// Avoid click delays for blocks that don't support naming interaction.
					if ( ! supportsBlockNaming ) {
						onClick( event );
						return;
					}

					if ( event.detail === SINGLE_CLICK ) {
						onClick( event );
					}
				} }
				onDoubleClick={ ( event ) => {
					event.preventDefault();
					if ( ! supportsBlockNaming ) {
						return;
					}
					toggleLabelEditingMode( true );
				} }
				onKeyDown={ onKeyDownHandler }
				tabIndex={ tabIndex }
				onFocus={ onFocus }
				onDragStart={ onDragStartHandler }
				onDragEnd={ onDragEnd }
				draggable={ draggable }
				href={ `#block-${ clientId }` }
				aria-hidden={ true }
			>
				<ListViewExpander onClick={ onToggleExpanded } />
				<BlockIcon icon={ blockInformation?.icon } showColors />
				<HStack
					alignment="center"
					className="block-editor-list-view-block-node__label-wrapper"
					justify="flex-start"
					spacing={ 1 }
				>
					<span className="block-editor-list-view-block-node__title">
						<Truncate ellipsizeMode="auto">{ blockTitle }</Truncate>
					</span>
					{ blockInformation?.anchor && (
						<span className="block-editor-list-view-block-node__anchor-wrapper">
							<Truncate
								className="block-editor-list-view-block-node__anchor"
								ellipsizeMode="auto"
							>
								{ blockInformation.anchor }
							</Truncate>
						</span>
					) }
					{ isLocked && (
						<span className="block-editor-list-view-block-node__lock">
							<Icon icon={ lock } />
						</span>
					) }
				</HStack>
				{ supportsBlockNaming && (
					<BlockOptionsRenameItem
						clientId={ clientId }
						onClick={ () => {
							toggleLabelEditingMode( true );
						} }
					/>
				) }
			</Button>
		</>
	);
}

export default forwardRef( ListViewBlockSelectButton );
