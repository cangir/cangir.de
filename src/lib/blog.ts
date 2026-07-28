import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogLang = 'en' | 'de' | 'tr';

export async function getLangPosts(lang: BlogLang) {
  const posts = await getCollection(
    'blog',
    ({ id, data }) => id.startsWith(`${lang}/`) && !data.draft,
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export interface TagSummary {
  tag: string;
  count: number;
}

export function getTagSummary(posts: CollectionEntry<'blog'>[]): TagSummary[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function postsByTag(posts: CollectionEntry<'blog'>[], tag: string) {
  return posts.filter((post) => post.data.tags.includes(tag));
}

// The closed, curated category universe (author-controlled, unlike the
// free-form `tags` array). Order here is the sidebar's display order.
export const CATEGORIES = ['Odoo', 'Frontend', 'DevOps', 'Technology', 'WordPress'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface CategorySummary {
  category: Category;
  count: number;
}

// Only categories with at least one post are returned, so the sidebar and
// static routes never render/generate an empty shell for an unused
// category from the fixed five-item list above.
export function getCategorySummary(posts: CollectionEntry<'blog'>[]): CategorySummary[] {
  const counts = new Map<Category, number>();
  for (const post of posts) {
    const category = post.data.category;
    if (!category) continue;
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return CATEGORIES.filter((category) => counts.has(category)).map((category) => ({
    category,
    count: counts.get(category)!,
  }));
}

export function postsByCategory(posts: CollectionEntry<'blog'>[], category: string) {
  return posts.filter((post) => post.data.category === category);
}
