/**
 * External dependencies
 */
import { kebabCase } from 'lodash';
import { View } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';

/**
 * WordPress dependencies
 */
import { BottomSheet, BottomSheetV2, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { helpFilled, plusCircleFilled, trash, cog } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import {
	requestContactCustomerSupport,
	requestGotoCustomerSupportOptions,
} from '@wordpress/react-native-bridge';
import { forwardRef, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './style.scss';
import HelpDetailNavigationScreen from './help-detail-navigation-screen';
import HelpTopicRow from './help-topic-row';
import HelpGetSupportButton from './help-get-support-button';
import IntroToBlocks from './intro-to-blocks';
import AddBlocks from './add-blocks';
import MoveBlocks from './move-blocks';
import RemoveBlocks from './remove-blocks';
import CustomizeBlocks from './customize-blocks';
import moveBlocksIcon from './icon-move-blocks';
import HelpSectionTitle from './help-section-title';

const HELP_TOPICS = [
	{
		label: __( 'What is a block?' ),
		icon: helpFilled,
		view: <IntroToBlocks />,
	},
	{
		label: __( 'Add blocks' ),
		icon: plusCircleFilled,
		view: <AddBlocks />,
	},
	{ label: __( 'Move blocks' ), icon: moveBlocksIcon, view: <MoveBlocks /> },
	{ label: __( 'Remove blocks' ), icon: trash, view: <RemoveBlocks /> },
	{
		label: __( 'Customize blocks' ),
		icon: cog,
		view: <CustomizeBlocks />,
	},
];

function EditorHelpTopics( props, ref ) {
	const { postType } = useSelect( ( select ) => ( {
		postType: select( editorStore ).getEditedPostAttribute( 'type' ),
	} ) );

	const close = () => {
		ref.current?.dismiss();
	};

	const title =
		postType === 'page'
			? __( 'How to edit your page' )
			: __( 'How to edit your post' );

	const snapPoints = useMemo( () => [ '94%' ], [] );

	return (
		<BottomSheetV2
			index={ -1 }
			ref={ ref }
			snapPoints={ snapPoints }
			testID="editor-help-modal"
		>
			<BottomSheet.NavigationContainer
				animate
				main
				style={ styles.navigationContainer }
			>
				<BottomSheet.NavigationScreen
					isScrollable
					fullScreen
					name="help-topics"
				>
					<View style={ styles.container }>
						<BottomSheet.NavBar>
							<BottomSheet.NavBar.DismissButton
								onPress={ close }
								iosText={ __( 'Close' ) }
							/>
							<BottomSheet.NavBar.Heading>
								{ title }
							</BottomSheet.NavBar.Heading>
						</BottomSheet.NavBar>
						<BottomSheetV2.ScrollView>
							<PanelBody>
								<HelpSectionTitle>
									{ __( 'The basics' ) }
								</HelpSectionTitle>
								{ /* Print out help topics. */ }
								{ HELP_TOPICS.map(
									( { label, icon }, index ) => {
										const labelSlug = kebabCase( label );
										const isLastItem =
											index === HELP_TOPICS.length - 1;
										return (
											<HelpTopicRow
												key={ labelSlug }
												label={ label }
												icon={ icon }
												screenName={ labelSlug }
												isLastItem={ isLastItem }
											/>
										);
									}
								) }
								{
									<HelpSectionTitle>
										{ __( 'Get support' ) }
									</HelpSectionTitle>
								}
								{
									<HelpGetSupportButton
										title={ __( 'Contact support' ) }
										onPress={
											requestContactCustomerSupport
										}
									/>
								}
								{
									<HelpGetSupportButton
										title={ __( 'More support options' ) }
										onPress={
											requestGotoCustomerSupportOptions
										}
									/>
								}
							</PanelBody>
						</BottomSheetV2.ScrollView>
					</View>
				</BottomSheet.NavigationScreen>
				{ /* Print out help detail screens. */ }
				{ HELP_TOPICS.map( ( { view, label } ) => {
					const labelSlug = kebabCase( label );
					return (
						<HelpDetailNavigationScreen
							key={ labelSlug }
							name={ labelSlug }
							content={ view }
							label={ label }
							options={ {
								gestureEnabled: false,
								...TransitionPresets.DefaultTransition,
							} }
						/>
					);
				} ) }
			</BottomSheet.NavigationContainer>
		</BottomSheetV2>
	);
}

export default forwardRef( EditorHelpTopics );
