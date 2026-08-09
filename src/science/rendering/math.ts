import katex from 'katex';
import 'katex/contrib/mhchem';

export type MathRenderResult = {
	html: string;
	error?: string;
};

const BASE_OPTIONS: katex.KatexOptions = {
	trust: false,
	strict: 'warn',
	throwOnError: true,
	output: 'htmlAndMathml',
};

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
 */
export function renderMathHtml(latex: string, displayMode: boolean): MathRenderResult {
	try {
		return {
			html: katex.renderToString(latex, { ...BASE_OPTIONS, displayMode }),
		};
	} catch (error) {
		const message = errorMessage(error);
		try {
			return {
				html: katex.renderToString(latex, {
					...BASE_OPTIONS,
					displayMode,
					strict: 'ignore',
					throwOnError: false,
				}),
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
