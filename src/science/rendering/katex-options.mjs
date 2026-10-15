/**
 * KaTeX's options for every formula: in the published blog
 * (`rehype-katex-mhchem.mjs`) and in the Studio (`math.ts`), so a formula
 * looks the same in both. A formula is first drawn with `katexOptions`;
 * one KaTeX rejects is drawn again with `lenientOptions` added, which shows
 * what it can and marks the rest in red.
 */
export const katexOptions = {
	trust: false,
	strict: 'warn',
	throwOnError: true,
	output: 'htmlAndMathml',
};

export const lenientOptions = {
	strict: 'ignore',
	throwOnError: false,
};
