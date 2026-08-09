// @ts-check

import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatexMhchem from './src/plugins/rehype-katex-mhchem.mjs';

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

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatexMhchem],
		}),
		syntaxHighlight: {
			type: 'shiki',
			excludeLangs: chemistryLanguages,
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
