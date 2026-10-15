import type { KatexOptions } from 'katex';

/** KaTeX's options for every formula, in the published blog and in the Studio. */
export declare const katexOptions: KatexOptions;
/** Added for a second try at a formula KaTeX rejects. */
export declare const lenientOptions: KatexOptions;
/** The site's macros, then the article's own, which win. */
export declare function macrosFor(articleMacros: unknown): Record<string, string>;
