/**
 * External dependencies
 */
import {
	BottomSheetModal,
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { FullWindowOverlay } from 'react-native-screens';

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
				opacity={ 0.8 }
			/>
		),
		[]
	);

	return (
		<FullWindowOverlay>
			<BottomSheetModal
				backdropComponent={ renderBackdrop }
				index={ index }
				ref={ ref }
				snapPoints={ snapPoints }
			>
				{ children }
			</BottomSheetModal>
		</FullWindowOverlay>
	);
}

const BottomSheetV2ForwardRef = forwardRef( BottomSheetV2 );

BottomSheetV2ForwardRef.ScrollView = BottomSheetScrollView;

export default BottomSheetV2ForwardRef;
