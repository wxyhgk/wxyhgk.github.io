// @ts-check

import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { codeFileFenceNames } from './src/code-files/languages.mjs';
import articleAssets from './src/plugins/article-assets.mjs';
import { chemistryLanguages, rehypePlugins, remarkPlugins } from './src/plugins/markdown-pipeline.mjs';
import milkdownSource from './src/plugins/milkdown-source.mjs';
import studioDev from './src/plugins/studio-dev.mjs';

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
		// Our plugins (markdown-pipeline.mjs), with GitHub's Markdown on our options in place of Astro's.
		processor: unified({ gfm: false, remarkPlugins, rehypePlugins }),
		syntaxHighlight: {
			type: 'shiki',
			// Molecules are drawn in the page; code files are highlighted by remark-code-files.
			excludeLangs: [...chemistryLanguages, ...codeFileFenceNames],
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
