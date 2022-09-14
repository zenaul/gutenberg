/**
 * External dependencies
 */
import FastAverageColor from 'fast-average-color';
import { colord } from 'colord';

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

function retrieveFastAverageColor() {
	if ( ! retrieveFastAverageColor.fastAverageColor ) {
		retrieveFastAverageColor.fastAverageColor = new FastAverageColor();
	}
	return retrieveFastAverageColor.fastAverageColor;
}

/**
 * useCoverIsDark is a hook that returns a boolean variable specifying if the cover
 * background is dark or not.
 *
 * @param {?string} url          Url of the media background.
 * @param {?number} dimRatio     Transparency of the overlay color. If an image and
 *                               color are set, dimRatio is used to decide what is used
 *                               for background darkness checking purposes.
 * @param {?string} overlayColor String containing the overlay color value if one exists.
 * @param {?Object} elementRef   If a media background is set, elementRef should contain a reference to a
 *                               dom element that renders that media.
 *
 * @return {boolean} True if the cover background is considered "dark" and false otherwise.
 */
export default function useCoverIsDark(
	url,
	dimRatio = 50,
	overlayColor,
	elementRef
) {
	const [ isDark, setIsDark ] = useState( false );
	useEffect( () => {
		if ( dimRatio > 50 || ! url || ! elementRef.current ) {
			// If opacity is greater than 50 the dominant color is the overlay
			// color, so use the overlay color for the dark mode computation.
			// Additionally, fall back to using the overlay color if a
			// background image isn't present since we don't have access to the
			// site background color for the calculations.
			// If no overlay color exists the overlay color is black (isDark).
			setIsDark( ! overlayColor || colord( overlayColor ).isDark() );
		} else {
			// If opacity is lower than 50 the dominant color is the media color,
			// so use the average media color for the dark mode computation.
			retrieveFastAverageColor().getColorAsync(
				elementRef.current,
				( color ) => {
					setIsDark( color.isDark );
				}
			);
		}
	}, [ dimRatio > 50, ! url, overlayColor, elementRef.current, setIsDark ] );
	return isDark;
}
