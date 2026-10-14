// @ts-check

import { existsSync, readFileSync, realpathSync } from 'node:fs';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkMath from 'remark-math';
import vue from '@vitejs/plugin-vue';
import articleAssets from './src/plugins/article-assets.mjs';
import rehypeArticleHtml from './src/plugins/rehype-article-html.mjs';
import rehypeKatexMhchem from './src/plugins/rehype-katex-mhchem.mjs';
import remarkMathBrackets from './src/plugins/remark-math-brackets.mjs';
import studioDev from './src/plugins/studio-dev.mjs';
import yiitapSource from './src/plugins/yiitap-source.mjs';

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
			remarkPlugins: [remarkMath, remarkMathBrackets],
			// Raw HTML in an article becomes elements, without scripts, event handlers or javascript: links.
			rehypePlugins: [rehypeArticleHtml, rehypeKatexMhchem],
		}),
		syntaxHighlight: {
			type: 'shiki',
			excludeLangs: chemistryLanguages,
		},
	},
	vite: {
		plugins: [
			vue({
				// TypeScript 7 no longer exposes ts.sys. Vue's SFC compiler
				// needs a filesystem to expand imported prop types.
				script: {
					fs: {
						fileExists: (file) => existsSync(file),
						readFile: (file) => {
							try {
								return readFileSync(file, 'utf8');
							} catch {
								return undefined;
							}
						},
						realpath: (file) => {
							try {
								return realpathSync(file);
							} catch {
								return file;
							}
						},
					},
				},
				template: {
					compilerOptions: {
						isCustomElement: (tag) => tag === 'model-viewer',
					},
				},
			}),
			yiitapSource(),
			studioDev({ chemistryLanguages }),
		],
		resolve: {
			dedupe: ['vue'],
		},
		define: {
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false,
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
		},
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
