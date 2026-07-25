// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wpmoo.org',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'tr'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
