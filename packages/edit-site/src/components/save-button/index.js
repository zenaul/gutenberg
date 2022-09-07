/**
 * External dependencies
 */
import { some } from 'lodash';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { displayShortcut } from '@wordpress/keycodes';

export default function SaveButton( {
	openEntitiesSavedStates,
	isEntitiesSavedStatesOpen,
} ) {
	const { isDirty, isSaving } = useSelect( ( select ) => {
		const { __experimentalGetDirtyEntityRecords, isSavingEntityRecord } =
			select( coreStore );
		const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
		return {
			isDirty: dirtyEntityRecords.length > 0,
			isSaving: some( dirtyEntityRecords, ( record ) =>
				isSavingEntityRecord( record.kind, record.name, record.key )
			),
		};
	}, [] );

	const disabled = ! isDirty || isSaving;

	const label = __( 'Save' );

	return (
		<Button
			variant="primary"
			className="edit-site-save-button__button"
			aria-disabled={ disabled }
			aria-expanded={ isEntitiesSavedStatesOpen }
			isBusy={ isSaving }
			onClick={ disabled ? undefined : openEntitiesSavedStates }
			label={ label }
			shortcut={ disabled ? undefined : displayShortcut.primary( 's' ) }
		>
			{ label }
		</Button>
	);
}
