const translations: Record<string, Record<string, string>> = {
  en: {
    'nav.blog': 'Blog',
    'home.tagline': 'Workflow Platform — Micro Object Oriented. I build tools for calmer development workflows, and write about the process here.',
    'home.blog.title': 'Blog',
    'home.blog.description': 'Notes from real projects — what worked, what broke, what I learned.',
    'home.ui.title': 'Moo UI',
    'home.ui.description': 'My open-source component system, built on Bootstrap 5.',
    'home.github.title': 'GitHub',
    'home.github.description': 'Code, experiments, and the occasional rabbit hole.',
    'blog.title': 'Blog',
    'blog.empty': 'Nothing here yet.',
    'blog.readMore': 'Read more',
  },
  de: {
    'nav.blog': 'Blog',
    'home.tagline': 'Workflow Platform — Micro Object Oriented. Ich baue Werkzeuge für ruhigere Entwicklungsabläufe und schreibe hier darüber.',
    'home.blog.title': 'Blog',
    'home.blog.description': 'Notizen aus echten Projekten — was funktionierte, was kaputtging, was ich lernte.',
    'home.ui.title': 'Moo UI',
    'home.ui.description': 'Mein Open-Source-Komponentensystem, gebaut auf Bootstrap 5.',
    'home.github.title': 'GitHub',
    'home.github.description': 'Code, Experimente und das eine oder andere Kaninchenloch.',
    'blog.title': 'Blog',
    'blog.empty': 'Noch nichts hier.',
    'blog.readMore': 'Weiterlesen',
  },
  tr: {
    'nav.blog': 'Blog',
    'home.tagline': 'Workflow Platform — Micro Object Oriented. Daha sakin geliştirme süreçleri için araçlar yapıyorum, burada da süreci yazıyorum.',
    'home.blog.title': 'Blog',
    'home.blog.description': 'Gerçek projelerden notlar — ne işe yaradı, ne kırıldı, ne öğrendim.',
    'home.ui.title': 'Moo UI',
    'home.ui.description': 'Bootstrap 5 üzerine kurduğum açık kaynak bileşen sistemi.',
    'home.github.title': 'GitHub',
    'home.github.description': 'Kod, deneyler ve ara sıra tavşan delikleri.',
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
