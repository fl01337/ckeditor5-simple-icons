import { Plugin, icons as defaultIcons } from 'ckeditor5/src/core';
import { ButtonView, ContextualBalloon } from 'ckeditor5/src/ui';
import ckeditor5Icon from '../theme/icons/ckeditor.svg';
import SimpleIconsView from './simpleIconsView';
import './styles.css';
/* global Buffer */
export default class SimpleIconsButtonUI extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	init() {
		const editor = this.editor;
		const t = editor.t;
		this._balloon = this.editor.plugins.get( ContextualBalloon );

		this.config = this.editor.config.get( 'SimpleIcons' ) || { icons: { ...defaultIcons } };

		this.simpleIconsView = new SimpleIconsView( this.editor.locale, this.config );

		// Hide the simpleIcons view after clicking the "Cancel" button.
		this.listenTo( this.simpleIconsView, 'cancel', () => {
			this._hideUI();
		} );

		this.listenTo( this.simpleIconsView, 'submit', e => {
			const svg = e.source.icon || null;
			if ( !svg ) {
				/* eslint-disable */
				console.log( 'svg not found.', e.source );
				/* eslint-enable */
				return false;
			}

			editor.model.change( writer => {
				const image = writer.createElement(
					'imageSimpleIcon',
					{ /* disable eslint */
						src: `data:image/svg+xml;base64,${ Buffer.from( svg ).toString( 'base64' ) }`
					}/* enable eslint */
				);

				editor.model.insertContent( image );
			} );

			this._hideUI();
			editor.editing.view.focus();
		} );

		editor.ui.componentFactory.add( 'simpleIconsButton', () => {
			const button = new ButtonView( this.editor.locale );

			button.set( {
				label: t( 'Simple icons' ),
				icon: ckeditor5Icon,
				tooltip: true
			} );

			this.listenTo( button, 'execute', () => {
				if ( this._balloon.visibleView != null ) { // already open -> close
					this._hideUI();
					return false;
				}

				// open
				this._balloon.add( {
					view: this.simpleIconsView,
					position: this._getBalloonPositionData()
				} );

				this.simpleIconsView.focus();
			} );

			return button;
		} );
	}

	_getBalloonPositionData() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;
		let target = null;

		// Set a target position by converting view selection range to DOM.
		target = () => view.domConverter.viewRangeToDom(
			viewDocument.selection.getFirstRange()
		);

		return {
			target
		};
	}

	_hideUI() {
		this.simpleIconsView.element.reset();

		this._balloon.remove( this.simpleIconsView );

		// Focus the editing view after closing the form view.
		this.editor.editing.view.focus();
	}
}
