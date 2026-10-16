export type Token = [text: string, name: string | null];
export type FenceMeta = { title: string; lines: { start: number; end: number } | null; open: boolean; fold: boolean };

export declare const TOKEN_COLORS: Readonly<Record<string, string>>;
export declare function tokenStyle(name: string | null): string;
export declare function highlightLines(language: string, source: string, keep?: (lineNumber: number) => boolean): (Token[] | null)[];
export declare function parseFenceMeta(meta: unknown): FenceMeta;
export declare const FOLD_AFTER: number;
export declare const FOLDED_LINES: number;
export declare const EXCERPT_AFTER: number;
export declare const HEAD_LINES: number;
export declare const TAIL_LINES: number;
export declare function excerptLines(
	text: string,
	range: { start: number; end: number } | null,
): { parts: { start: number; lines: string[] }[]; total: number };
export declare function downloadName(language: string, title?: string, path?: string): string;
