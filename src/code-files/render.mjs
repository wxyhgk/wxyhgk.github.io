import { codeFileLanguage } from './languages.mjs';
import { FOLD_AFTER, FOLDED_LINES, downloadName, excerptLines, highlightLines, tokenStyle } from './highlight.mjs';

/** The look of Shiki's github-dark blocks, so these sit with the blog's other code. */
export const PRE_STYLE = 'background-color:#24292e;color:#e1e4e8; overflow-x: auto;';

/** @typedef {{ type: 'element'; tagName: string; properties: Record<string, unknown>; children: HastChild[] }} HastElement */
/** @typedef {HastElement | { type: 'text'; value: string }} HastChild */

/** @returns {HastElement} */
function h(tagName, properties, children = []) {
	return { type: 'element', tagName, properties, children };
}

function text(value) {
	return { type: 'text', value };
}

/**
 * The bar above a code file: its name, what it is, and where to get it.
 * `href` is the file's address for a block that names one; a block written in
 * the article is downloaded from its text.
 * @param {{ language: string; title?: string; path?: string; href?: string; total?: number }} file
 */
export function codeFileBar({ language, title = '', path = '', href = '', total }) {
	const name = downloadName(language, title, path);
	const kind = codeFileLanguage(language)?.label ?? (language || '代码');
	const children = [h('span', { className: ['code-file-name'] }, [text(title || path.split('/').pop() || kind)])];
	if ((title || path) && kind) children.push(h('span', { className: ['code-file-kind'] }, [text(kind)]));
	if (total !== undefined) children.push(h('span', { className: ['code-file-size'] }, [text(`${total} 行`)]));
	children.push(h('span', { className: ['code-file-actions'] }, [
		h('button', { type: 'button', className: ['code-file-copy'], dataCodeAction: 'copy' }, [text('复制')]),
		href
			? h('a', { className: ['code-file-download'], href, download: name }, [text('下载')])
			: h('button', { type: 'button', className: ['code-file-download'], dataCodeAction: 'download', dataFileName: name }, [text('下载')]),
	]));
	return h('figcaption', { className: ['code-file-bar'] }, children);
}

/**
 * Whether a block of `lines` lines folds, and to how many: long ones fold
 * unless their meta says `open`; `fold` folds any.
 */
export function foldFor(lines, meta) {
	if (meta.open) return 0;
	if (meta.fold || lines > FOLD_AFTER) return Math.min(FOLDED_LINES, lines);
	return 0;
}

/** The attributes of the figure around a code block. */
export function figureProperties(language, fold, extra = []) {
	const properties = { className: ['code-file', ...extra], dataLanguage: language };
	if (fold) properties.dataFold = String(fold);
	return properties;
}

function lineElement(tokens, number) {
	const properties = { className: ['line'] };
	if (number !== undefined) properties.dataLine = String(number);
	return h('span', properties, tokens.map(([value, name]) => {
		const style = tokenStyle(name);
		return style ? h('span', { style }, [text(value)]) : text(value);
	}));
}

/**
 * A code-file block (```orca, ```output, …) as HTML: highlighted, in a figure
 * with its bar. With `file`, the block shows that file: the lines its meta
 * names, or its head and tail when long, numbered as in the file.
 * @param {{
 *   language: string;
 *   meta: { title: string; lines: { start: number; end: number } | null; open: boolean; fold: boolean };
 *   source: string;
 *   file?: { path: string; text: string; href: string };
 * }} block
 * @returns {HastElement}
 */
export function codeFileFigure({ language, meta, source, file }) {
	const name = codeFileLanguage(language)?.name ?? language;
	const lines = [];
	let shown = 0;
	if (file) {
		const { parts, total } = excerptLines(file.text, meta.lines);
		const kept = new Set(parts.flatMap((part) => part.lines.map((_, index) => part.start + index)));
		const tokens = highlightLines(name, file.text.replace(/\r?\n$/, ''), (number) => kept.has(number));
		parts.forEach((part, index) => {
			if (index > 0) {
				const from = parts[index - 1].start + parts[index - 1].lines.length;
				lines.push(h('span', { className: ['line', 'code-file-gap'] }, [text(`⋯ 省略第 ${from}–${part.start - 1} 行，下载可看完整文件 ⋯`)]));
			}
			part.lines.forEach((_, offset) => lines.push(lineElement(tokens[part.start + offset - 1] ?? [], part.start + offset)));
			shown += part.lines.length;
		});
		const fold = foldFor(shown + parts.length - 1, meta);
		return h('figure', figureProperties(name, fold, ['has-line-numbers']), [
			codeFileBar({ language: name, title: meta.title, path: file.path, href: file.href, total }),
			pre(name, lines),
		]);
	}
	const tokens = highlightLines(name, source);
	for (const line of tokens) lines.push(lineElement(line ?? []));
	return h('figure', figureProperties(name, foldFor(tokens.length, meta)), [
		codeFileBar({ language: name, title: meta.title }),
		pre(name, lines),
	]);
}

function pre(language, lines) {
	const children = [];
	lines.forEach((line, index) => {
		if (index > 0) children.push(text('\n'));
		children.push(line);
	});
	return h('pre', { className: ['astro-code', 'github-dark'], style: PRE_STYLE, tabIndex: 0, dataLanguage: language }, [
		h('code', { className: [`language-${language}`] }, children),
	]);
}

/** A figure for a block that cannot be shown, saying why. */
export function codeFileProblem(language, message) {
	return h('figure', { className: ['code-file', 'is-problem'], dataLanguage: language }, [
		h('figcaption', { className: ['code-file-bar'] }, [h('span', { className: ['code-file-name'] }, [text(message)])]),
	]);
}
