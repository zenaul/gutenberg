/**
 * External dependencies
 */
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Modal } from 'react-native';

/**
 * WordPress dependencies
 */
import {
	forwardRef,
	useCallback,
	useState,
	useImperativeHandle,
	useRef,
} from '@wordpress/element';

function BottomSheetV2(
	{ children, index = 0, snapPoints = [ '50%' ] } = {},
	ref
) {
	const [ visible, setVisible ] = useState( false );
	const bottomSheetRef = useRef( null );

	const handlePresent = useCallback( () => {
		setVisible( true );
	} );

	const handleDismiss = useCallback( () => {
		bottomSheetRef.current?.close();
	} );

	/**
	 * Utilize imperative handle to mimic the `@gorhom/bottom-sheet` API, which
	 * would simplify migrating to `BottomSheetModal` in the future once the
	 * editor header navigation is rendered by React Native, not the native host
	 * app.
	 */
	useImperativeHandle( ref, () => ( {
		present: handlePresent,
		dismiss: handleDismiss,
	} ) );

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
		<Modal transparent={ true } visible={ visible }>
			<BottomSheet
				backdropComponent={ renderBackdrop }
				enablePanDownToClose={ true }
				index={ index }
				onClose={ () => {
					setVisible( false );
				} }
				ref={ bottomSheetRef }
				snapPoints={ snapPoints }
			>
				{ children }
			</BottomSheet>
		</Modal>
	);
}

const BottomSheetV2ForwardRef = forwardRef( BottomSheetV2 );

BottomSheetV2ForwardRef.ScrollView = BottomSheetScrollView;

export default BottomSheetV2ForwardRef;
