import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.enum(['Odoo', 'Frontend', 'DevOps', 'Technology', 'WordPress']).optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    description: z.string(),
    focusLabel: z.string(),
    focus: z.string(),
    principlesEyebrow: z.string(),
    principlesTitle: z.string(),
    principles: z.array(z.object({ title: z.string(), description: z.string() })),
    contact: z.string(),
    githubLabel: z.string(),
  }),
});

export const collections = { blog, pages };
