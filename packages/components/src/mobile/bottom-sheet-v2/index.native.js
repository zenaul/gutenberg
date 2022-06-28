/**
 * External dependencies
 */
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { View } from 'react-native';

/**
 * WordPress dependencies
 */
import { useMemo, forwardRef, useEffect } from '@wordpress/element';

function BottomSheetV2( { children }, ref ) {
	const snapPoints = useMemo( () => [ '50%', '120%' ], [] );

	return (
		<BottomSheetModal index={ 1 } ref={ ref } snapPoints={ snapPoints }>
			{ children }
		</BottomSheetModal>
	);
}

export const BottomSheetV2ScrollView = BottomSheetScrollView;

export default forwardRef( BottomSheetV2 );
