import { defineCollection, z, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';

const itemSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    image: image().optional(),
    imageAlt: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
    tags: z.array(z.string()).default([]),
  });

const reviewSchema = (ctx: SchemaContext) =>
  itemSchema(ctx).extend({
    rating: z.number().min(0).max(5).optional(),
  });

const technical = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/technical' }),
  schema: itemSchema,
});

const hobbies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hobbies' }),
  schema: itemSchema,
});

const food = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/food' }),
  schema: reviewSchema,
});

const media = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/media' }),
  schema: reviewSchema,
});

export const collections = { technical, hobbies, food, media };
