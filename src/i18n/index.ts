// This table only carries copy shared across templates (nav, blog chrome).
// Page-specific copy lives with its page: HomePage.astro owns its own
// localized labels object, and the about pages read theirs from the `pages`
// content collection (src/content/pages/<lang>/about.md).
const translations: Record<string, Record<string, string>> = {
  en: {
    'nav.blog': 'Blog',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'blog.title': 'Blog',
    'blog.empty': 'Nothing here yet.',
    'blog.readMore': 'Read more',
  },
  de: {
    'nav.blog': 'Blog',
    'nav.projects': 'Projekte',
    'nav.about': 'Über mich',
    'blog.title': 'Blog',
    'blog.empty': 'Noch nichts hier.',
    'blog.readMore': 'Weiterlesen',
  },
  tr: {
    'nav.blog': 'Blog',
    'nav.projects': 'Projeler',
    'nav.about': 'Hakkımda',
    'blog.title': 'Blog',
    'blog.empty': 'Henüz bir şey yok.',
    'blog.readMore': 'Devamını oku',
  },
};

export const defaultLocale = 'en';
export const locales = ['en', 'de', 'tr'] as const;

export function t(locale: string, key: string): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
