import katex from 'katex';
import 'katex/contrib/mhchem';

import { prepareFormula, type EquationLabel } from './equations.mjs';
import { katexOptions, lenientOptions, macrosFor } from './katex-options.mjs';

export type MathRenderResult = {
	html: string;
	error?: string;
};

let macros = macrosFor(null);

/** The article being edited: its formulas use the site's macros, then its own `macros:`. */
export function useArticleMacros(articleMacros: unknown): void {
	macros = macrosFor(articleMacros);
}

function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : '无法渲染公式';
}

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');
}

/**
 * Render trusted application output from untrusted LaTeX source.
 *
 * Parse failures are represented in the returned HTML and `error`; callers do
 * not need a try/catch. `mhchem` is registered on the same KaTeX instance.
 * `\label`s are dropped and `\eqref`s shown from `labels` (`equations.mjs`).
 */
export function renderMathHtml(latex: string, displayMode: boolean, labels?: Map<string, EquationLabel>): MathRenderResult {
	const source = prepareFormula(latex, labels);
	try {
		return {
			html: katex.renderToString(source, { ...katexOptions, macros, displayMode }),
		};
	} catch (error) {
		const message = errorMessage(error);
		try {
			return {
				html: katex.renderToString(source, { ...katexOptions, ...lenientOptions, macros, displayMode }),
				error: message,
			};
		} catch {
			return {
				html: `<span class="katex-error" title="${escapeHtml(message)}">${escapeHtml(latex)}</span>`,
				error: message,
			};
		}
	}
}
