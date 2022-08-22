/**
 * External dependencies
 */
import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { StoryIndex, StoryIndexEntry } from '@storybook/store';

const STORYBOOK_PORT = '50240';
const STORYBOOK_DIR = resolve( __dirname, '../../storybook/build' );

const { stories }: StoryIndex = JSON.parse(
	readFileSync( resolve( STORYBOOK_DIR, 'stories.json' ) ).toString()
);

const includeIds = [ /^components-/ ];
const excludeIds = [ /animate/, /zstack/ ];

const filterMatches = ( story: StoryIndexEntry ) => {
	// return story.id.includes( 'components-fontsizepicker--default' );
	const isIncluded = includeIds.some( ( includeRegex ) =>
		includeRegex.test( story.id )
	);
	const isExcluded = excludeIds.some( ( excludeRegex ) =>
		excludeRegex.test( story.id )
	);
	return isIncluded && ! isExcluded;
};

test.describe.parallel( 'Storybook visual regressions', () => {
	Object.values( stories )
		.filter( filterMatches )
		.forEach( ( story ) => {
			test( `${ story.title }: ${ story.name }`, async ( { page } ) => {
				await page.goto(
					`http://localhost:${ STORYBOOK_PORT }/iframe.html?id=${ story.id }`
				);

				// Option A: Debounce the screenshot by waiting until DOM mutations stop.
				await page.evaluate(
					() =>
						new Promise( ( res, rej ) => {
							const rootEl = document.querySelector( '#root' );

							let mutationTimer = setTimeout( res, 200 );
							const observer = new MutationObserver( () => {
								clearTimeout( mutationTimer );
								mutationTimer = setTimeout( res, 200 );
							} );

							observer.observe( rootEl, {
								subtree: true,
								childList: true,
								attributes: true,
							} );
						} )
				);

				// Option B: Wait for transitionend to be fired.
				// await page.evaluate(
				// 	() =>
				// 		new Promise( ( res, rej ) => {
				// 			document.addEventListener( 'transitionend', () =>
				// 				res( true )
				// 			);
				// 			setTimeout( () => res( false ), 500 );
				// 		} )
				// );
				// await page.pause();
				expect(
					await page
						.locator( '#root' )
						.screenshot( { animations: 'disabled' } )
				).toMatchSnapshot( [ story.title, `${ story.id }.png` ] );
			} );
		} );
} );
