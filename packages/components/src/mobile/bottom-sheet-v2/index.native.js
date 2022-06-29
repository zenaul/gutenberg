/**
 * External dependencies
 */
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

function BottomSheetV2(
	{ children, index = 0, snapPoints = [ '50%' ] } = {},
	ref
) {
	return (
		<BottomSheetModal index={ index } ref={ ref } snapPoints={ snapPoints }>
			{ children }
		</BottomSheetModal>
	);
}

export const BottomSheetV2ScrollView = BottomSheetScrollView;

export default forwardRef( BottomSheetV2 );
