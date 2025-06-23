/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit() {
	// Static JSON data
	const alphabet = 'ALPHABET#'.split( '' );
	const aToZData = [
		{
			letter: 'A',
			posts: [
				{ ID: 1, url: '#', title: 'Academic Appeals' },
				{ ID: 2, url: '#', title: 'Academic Calendars' },
				{ ID: 3, url: '#', title: 'Academic Inclusive Initiatives' },
			],
		},
	];

	return (
		<>
			<div className="a-to-z-container-banner wp-block-block alignfull utkwds-orange-bar-texture has-orange-background-color has-background" />
			<div
				{ ...useBlockProps() }
				className="a-to-z-index alignwide"
				id="alpha"
			>
				{ __(
					<>
						<div className="a-to-z-index-input">
							<div class="form-floating">
								<input
									className="form-control"
									aria-label="Search the index"
									id="a-to-z-search"
									name="search"
									type="search"
									placeholder="Search the index"
								/>
								<label for="a-to-z-search">
									Search the index
								</label>
							</div>
						</div>
						<div className="a-to-z-index-alphabet">
							{ alphabet.map( ( item ) => (
								<div
									className="a-to-z-index-alphabet-letter"
									key={ item }
								>
									<button className="a-to-z-index-alphabet-letter-button">
										{ item }
									</button>
								</div>
							) ) }
						</div>
						<div className="a-to-z-index-sections">
							{ aToZData.map( ( group ) => (
								<div
									key={ group.letter }
									id={ group.letter }
									className="a-to-z-index-section"
								>
									<div className="a-to-z-index-section-drop-cap">
										<div className="a-to-z-index-section-drop-cap-letter">
											{ group.letter }
										</div>
									</div>
									<div className="a-to-z-index-section-content">
										<ul className="a-to-z-index-section-list">
											{ group.posts.map( ( item ) => (
												<li
													key={ item.ID }
													className="a-to-z-index-section-list-item"
												>
													<a href={ item.url }>
														{ item.title }
													</a>
												</li>
											) ) }
										</ul>
									</div>
								</div>
							) ) }
						</div>
					</>
				) }
			</div>
		</>
	);
}
