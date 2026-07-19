import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const itemSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: z.coerce.date(),
  links: z
    .array(z.object({ label: z.string(), url: z.string().url() }))
    .default([]),
  tags: z.array(z.string()).default([]),
});

const technical = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/technical' }),
  schema: itemSchema,
});

const hobbies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hobbies' }),
  schema: itemSchema,
});

export const collections = { technical, hobbies };
