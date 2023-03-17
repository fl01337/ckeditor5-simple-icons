import { View, ButtonView, submitHandler } from 'ckeditor5/src/ui';
import { icons } from 'ckeditor5/src/core';

export default class SimpleIconsView extends View {
	constructor( locale, config ) {
		super( locale );

		const t = locale.t;

		this.icons = config.icons;

		this.iconList = [];

		Object.keys( this.icons ).forEach( key => {
			const icn = this._createButton(
				'', // t(`SimpleIcons${key.charAt(0).toUpperCase()}${key.slice(1)}`),
				this.icons[ key ],
				'simple-icons-btn ck-button-' + key
			);

			icn.delegate( 'execute' ).to( this, 'submit' );
			this.iconList.push( icn );
		} );

		this.cancelButtonView = this._createButton(
			t( 'close' ),
			icons.cancel,
			'ck-button-cancel cancel'
		);
		this.cancelButtonView.withText = true;

		this.childViews = this.createCollection( [
			// add icons here
			...this.iconList,
			this.cancelButtonView
		] );

		this.setTemplate( {
			tag: 'form',
			attributes: {
				class: 'ck ck-simple-icons-form',
				tabindex: '-1'
			},
			children: this.childViews
		} );

		// Delegate ButtonView#execute to SimpleIconsView#cancel.
		this.cancelButtonView.delegate( 'execute' ).to( this, 'cancel' );
	}

	render() {
		super.render();
		submitHandler( {
			view: this
		} );
	}

	focus() {
		this.childViews.last.focus();
		// this.cancelButtonView.focus(); //test
	}

	_createButton( label, icon, className ) {
		const button = new ButtonView();

		button.set( {
			label,
			icon,
			tooltip: true,
			class: className
		} );

		return button;
	}
}
