import type { MoleculeBlock, MoleculeViewerFormat } from '../model.ts';
import { parseScienceResourceRef } from './resource-reference.ts';
import { sdfHas3DCoordinates } from './sdf.ts';

const EXPLICIT_TWO_D_FORMATS = new Set(['smiles', 'sdf-2d', 'mol-2d']);
const THREE_D_FORMATS: Readonly<Record<string, MoleculeViewerFormat>> = {
	xyz: 'xyz', gjf: 'xyz', com: 'xyz', pdb: 'pdb', mol2: 'mol2', cif: 'cif', cube: 'cube',
	'sdf-3d': 'sdf', 'mol-3d': 'sdf', 'xyz-3d': 'xyz', 'pdb-3d': 'pdb',
	'mol2-3d': 'mol2', 'cif-3d': 'cif', 'cube-3d': 'cube',
};

/** Whether a fence's language is a molecular format, judged from the language alone, so it never throws. */
export function isMoleculeLanguage(languageInput: string): boolean {
	const language = languageInput.trim().toLowerCase();
	return language === 'sdf' || language === 'mol' || EXPLICIT_TWO_D_FORMATS.has(language) || language in THREE_D_FORMATS;
}

/**
 * Classify a Markdown code fence without touching the DOM or loading a renderer.
 * Throws InvalidScienceResourcePathError for an `@file` outside the article's assets.
 */
export function parseMoleculeBlock(languageInput: string, source: string): MoleculeBlock | null {
	if (!isMoleculeLanguage(languageInput)) return null;
	const language = languageInput.trim().toLowerCase();
	const isAutoSdf = language === 'sdf' || language === 'mol';

	const resource = parseScienceResourceRef(source);
	if (isAutoSdf) {
		return {
			type: 'molecule',
			language,
			view: resource.kind === 'file' ? 'auto' : sdfHas3DCoordinates(resource.text) ? '3d' : '2d',
			resource,
			viewerFormat: 'sdf',
		};
	}
	if (EXPLICIT_TWO_D_FORMATS.has(language)) {
		return { type: 'molecule', language, view: '2d', resource };
	}
	return { type: 'molecule', language, view: '3d', resource, viewerFormat: THREE_D_FORMATS[language] };
}
