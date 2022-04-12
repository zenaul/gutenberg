/**
 * External dependencies
 */
import { css } from '@emotion/react';

/**
 * Internal dependencies
 */
import { CONFIG, COLORS } from '../../utils';

export const toggleGroupControl = css`
	background: ${ COLORS.ui.background };
	border: 1px solid;
	border-color: ${ COLORS.ui.border };
	border-radius: ${ CONFIG.controlBorderRadius };
	display: inline-flex;
	min-height: ${ CONFIG.controlHeight };
	min-width: 0;
	padding: 2px;
	position: relative;
	&:hover {
		border-color: ${ COLORS.ui.borderHover };
	}

	&:focus-within {
		border-color: ${ COLORS.ui.borderFocus };
		box-shadow: ${ CONFIG.controlBoxShadowFocus };
		outline: none;
		z-index: 1;
	}
`;

export const block = css`
	display: flex;
	width: 100%;
`;
