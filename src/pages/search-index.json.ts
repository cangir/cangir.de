import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const index = posts.map((post) => {
    const locale = post.id.split('/')[0];
    const slug = post.id.replace(/^[a-z]{2}\//, '').replace(/\/$/, '');
    const prefix = locale === 'en' ? '' : `/${locale}`;
    return {
      title: post.data.title,
      description: post.data.description,
      href: `${prefix}/blog/${slug}/`,
      tags: post.data.tags ?? [],
    };
  });

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
