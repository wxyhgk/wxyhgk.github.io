import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { createArticleFrontmatterSchema } from './studio/server/schemas.mjs';

const blog = defineCollection({
	// Each article is a self-contained bundle at `blog/<slug>/index.md`.
	loader: glob({
		base: './blog',
		pattern: '**/index.{md,mdx}',
		generateId: ({ entry }) => entry.replace(/\/index\.(md|mdx)$/, ''),
	}),
	// Type-check frontmatter using a schema
	schema: ({ image }) => createArticleFrontmatterSchema(image),
});

export const collections = { blog };
