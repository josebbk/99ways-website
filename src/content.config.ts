import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    url: z.string(),
    category: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    authorName: z.string().optional(),
    commentCount: z.number().default(0),
  }),
});

export const collections = { blog };
