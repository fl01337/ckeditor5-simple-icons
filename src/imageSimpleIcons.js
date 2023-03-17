
import { Plugin } from 'ckeditor5/src/core';
import { toWidget, Widget } from 'ckeditor5/src/widget';
// import { Widget } from 'ckeditor5/src/widget';

export default class ImageSimpleIcons extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		// console.log( 'ImageSimpleIcons#init() got called' );

		this._defineSchema();
		this._defineConverters();
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'imageSimpleIcon', {
			// Behaves like a self-contained inline object (e.g. an inline image)
			// allowed in places where $text is allowed (e.g. in paragraphs).
			// The inline widget can have the same attributes as text (for example linkHref, bold).
			inheritAllFrom: '$inlineObject',

			allowAttributes: [ 'src' ]
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'span',
				classes: [ 'simple-icons-image' ]
			},
			model: ( viewElement, { writer: modelWriter } ) => {
				return modelWriter.createElement( 'imageSimpleIcon', { src: viewElement.getChild( 0 ).getAttribute( 'src' ) } );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'imageSimpleIcon',
			view: ( modelItem, { writer: viewWriter } ) => {
				const widgetElement = createImageSimpleIconView( modelItem, viewWriter );

				// Enable widget handling on a placeholder element inside the editing view.
				return toWidget( widgetElement, viewWriter );
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'imageSimpleIcon',
			view: ( modelItem, { writer: viewWriter } ) => createImageSimpleIconView( modelItem, viewWriter )
		} );

		// Helper method for both downcast converters.
		function createImageSimpleIconView( modelItem, viewWriter ) {
			const container = viewWriter.createContainerElement( 'span', {
				class: 'simple-icons-image'
			} );

			const image = viewWriter.createEditableElement( 'img', {
				src: modelItem.getAttribute( 'src' )
			} );

			viewWriter.insert( viewWriter.createPositionAt( container, 0 ), image );

			return container;
		}
	}
}
