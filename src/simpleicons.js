import SimpleIconsButtonUI from './simpleIconsButtonUI';
import { Plugin } from 'ckeditor5/src/core';
import ImageSimpleIcons from './imageSimpleIcons';

export default class SimpleIcons extends Plugin {
	static get requires() {
		return [ SimpleIconsButtonUI, ImageSimpleIcons ];
	}
}
