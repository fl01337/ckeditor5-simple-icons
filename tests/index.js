import { SimpleIcons as SimpleIconsDll, icons } from '../src';
import SimpleIcons from '../src/simpleicons';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 SimpleIcons DLL', () => {
	it( 'exports SimpleIcons', () => {
		expect( SimpleIconsDll ).to.equal( SimpleIcons );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );
