import { StringStream } from '@codemirror/language';

import { codeFileLanguage } from './languages.mjs';

/**
 * Colours for the token names, after the blog's Shiki theme (github-dark),
 * so these blocks sit with the highlighted ones.
 */
export const TOKEN_COLORS = Object.freeze({
	comment: '#6a737d',
	keyword: '#f97583',
	meta: '#ffab70',
	typeName: '#b392f0',
	propertyName: '#79b8ff',
	variableName: '#ffab70',
	number: '#79b8ff',
	atom: '#79b8ff',
	string: '#9ecbff',
	unit: '#b392f0',
	operator: '#f97583',
	invalid: '#fdaeb7',
	changed: '#ffab70',
	inserted: '#85e89d',
});

/** How a token is drawn: its colour and weight. */
export function tokenStyle(name) {
	if (!name) return '';
	const parts = name.split(' ');
	const color = parts.map((part) => TOKEN_COLORS[part]).find(Boolean);
	const styles = [];
	if (color) styles.push(`color:${color}`);
	if (parts.includes('strong') || parts.includes('invalid') || parts.includes('inserted')) styles.push('font-weight:600');
	return styles.join(';');
}

/**
 * The tokens of each line of `source` as the language's stream parser reads
 * them: `[text, token name or null][]` per line. Runs of one token name are
 * merged. An unknown language gives each line as one plain token.
 *
 * `keep(lineNumber)` limits the result to the lines shown (the rest are
 * null); every line is still read, so a parser that counts lines or sections
 * colours the kept ones as it would in the whole file.
 * @param {string} language
 * @param {string} source
 * @param {(lineNumber: number) => boolean} [keep]
 * @returns {([string, string | null][] | null)[]}
 */
export function highlightLines(language, source, keep = () => true) {
	const lines = String(source).split(/\r?\n/);
	const parser = codeFileLanguage(language)?.parser;
	const state = parser?.startState();
	return lines.map((line, index) => {
		const kept = keep(index + 1);
		if (!parser) return kept ? (line ? [[line, null]] : []) : null;
		if (!line) {
			parser.blankLine?.(state);
			return kept ? [] : null;
		}
		const stream = new StringStream(line, 4, 2);
		const tokens = [];
		while (!stream.eol()) {
			stream.start = stream.pos;
			const name = parser.token(stream, state) ?? null;
			// A parser that reads nothing would loop forever.
			if (stream.pos === stream.start) stream.next();
			if (!kept) continue;
			const text = line.slice(stream.start, stream.pos);
			const last = tokens[tokens.length - 1];
			if (last && last[1] === name) last[0] += text;
			else tokens.push([text, name]);
		}
		return kept ? tokens : null;
	});
}

/**
 * What a fence's meta asks for: `title="opt.log" lines=120-180 open fold`.
 * Keys take a value, with or without quotes; bare words are flags.
 */
export function parseFenceMeta(meta) {
	const result = { title: '', lines: null, open: false, fold: false };
	const pattern = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
	for (const match of String(meta ?? '').matchAll(pattern)) {
		const key = match[1].toLowerCase();
		const value = match[2] ?? match[3] ?? match[4];
		if (key === 'title' && value !== undefined) result.title = value;
		else if (key === 'lines' && value !== undefined) {
			const range = value.match(/^(\d+)(?:-(\d+)?)?$/);
			if (range) {
				const start = Math.max(1, Number(range[1]));
				const end = range[2] ? Number(range[2]) : range[0].includes('-') ? Infinity : start;
				if (end >= start) result.lines = { start, end };
			}
		} else if (key === 'open' && value === undefined) result.open = true;
		else if (key === 'fold' && value === undefined) result.fold = true;
	}
	return result;
}

/** Blocks longer than this many lines fold, showing `FOLDED_LINES` of them. */
export const FOLD_AFTER = 30;
export const FOLDED_LINES = 15;
/** A file longer than this shows its head and tail, `HEAD_LINES` and `TAIL_LINES` of them. */
export const EXCERPT_AFTER = 400;
export const HEAD_LINES = 200;
export const TAIL_LINES = 100;

/**
 * The lines of a file a block shows: the range its meta names, or for a long
 * file the head and the tail with a gap between. Each part keeps its first
 * line's number, so the file's own line numbers can be drawn.
 * @returns {{ parts: { start: number; lines: string[] }[]; total: number }}
 */
export function excerptLines(text, range) {
	const lines = String(text).replace(/\r?\n$/, '').split(/\r?\n/);
	const total = lines.length;
	if (range) {
		const start = Math.min(range.start, total);
		return { parts: [{ start, lines: lines.slice(start - 1, Math.min(range.end, total)) }], total };
	}
	if (total <= EXCERPT_AFTER) return { parts: [{ start: 1, lines }], total };
	return {
		parts: [
			{ start: 1, lines: lines.slice(0, HEAD_LINES) },
			{ start: total - TAIL_LINES + 1, lines: lines.slice(total - TAIL_LINES) },
		],
		total,
	};
}

/** The name a block's content is downloaded under: its title, else its language's usual file name. */
export function downloadName(language, title, path) {
	if (title) return title.split('/').pop();
	if (path) return path.split('/').pop();
	return codeFileLanguage(language)?.file ?? 'code.txt';
}
