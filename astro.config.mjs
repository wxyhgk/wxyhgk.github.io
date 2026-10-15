// @ts-check

import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import articleAssets from './src/plugins/article-assets.mjs';
import { gfmOptions } from './src/plugins/markdown-gfm.mjs';
import rehypeArticleHtml from './src/plugins/rehype-article-html.mjs';
import rehypeKatexMhchem from './src/plugins/rehype-katex-mhchem.mjs';
import remarkMathBrackets from './src/plugins/remark-math-brackets.mjs';
import milkdownSource from './src/plugins/milkdown-source.mjs';
import studioDev from './src/plugins/studio-dev.mjs';

const chemistryLanguages = [
	'smiles',
	'sdf',
	'mol',
	'xyz',
	'gjf',
	'com',
	'pdb',
	'mol2',
	'cif',
	'cube',
	'sdf-2d',
	'mol-2d',
	'sdf-3d',
	'mol-3d',
	'xyz-3d',
	'pdb-3d',
	'mol2-3d',
	'cif-3d',
	'cube-3d',
];

/**
 * The Studio is a writing tool for this machine only: its page joins the dev
 * server and is never built, so the published site carries none of its code.
 * @returns {import('astro').AstroIntegration}
 */
function studioPage() {
	return {
		name: 'studio-page',
		hooks: {
			'astro:config:setup': ({ command, injectRoute }) => {
				if (command === 'dev') injectRoute({ pattern: '/studio', entrypoint: './src/studio/StudioPage.astro' });
			},
		},
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://wxyhgk.github.io',
	integrations: [mdx(), sitemap(), articleAssets(), studioPage()],
	markdown: {
		processor: unified({
			// GitHub's Markdown with our options, in place of Astro's.
			gfm: false,
			remarkPlugins: [[remarkGfm, gfmOptions], remarkMath, remarkMathBrackets],
			// Raw HTML in an article becomes elements, without scripts, event handlers or javascript: links.
			rehypePlugins: [rehypeArticleHtml, rehypeKatexMhchem],
		}),
		syntaxHighlight: {
			type: 'shiki',
			excludeLangs: chemistryLanguages,
		},
	},
	vite: {
		plugins: [milkdownSource({ root: fileURLToPath(new URL('.', import.meta.url)) }), studioDev()],
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
