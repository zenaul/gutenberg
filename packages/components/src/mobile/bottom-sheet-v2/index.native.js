/**
 * External dependencies
 */
import {
	BottomSheetModal,
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

/**
 * WordPress dependencies
 */
import { forwardRef, useCallback } from '@wordpress/element';

function BottomSheetV2(
	{ children, index = 0, snapPoints = [ '50%' ] } = {},
	ref
) {
	const renderBackdrop = useCallback(
		( props ) => (
			<BottomSheetBackdrop
				{ ...props }
				disappearsOnIndex={ -1 }
				appearsOnIndex={ 0 }
			/>
		),
		[]
	);
	return (
		<BottomSheetModal
			backdropComponent={ renderBackdrop }
			index={ index }
			ref={ ref }
			snapPoints={ snapPoints }
		>
			{ children }
		</BottomSheetModal>
	);
}

export const BottomSheetV2ScrollView = BottomSheetScrollView;

export default forwardRef( BottomSheetV2 );
