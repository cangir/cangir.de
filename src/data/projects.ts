export type SiteLocale = 'en' | 'de' | 'tr';

interface LocalizedProjectCopy {
  title: string;
  summary: string;
  problem: string;
  role: string;
  result: string;
  status: string;
}

export interface PortfolioProject {
  slug: 'wpmoo' | 'moo-ui';
  // WPMoo stays in the registry (real facts, real links) but is not yet
  // shown as a visible portfolio project -- explicit user choice
  // (2026-07-28): only Moo UI, the one currently-running public project,
  // renders on the homepage and /work/ until WPMoo is turned back on.
  featured: boolean;
  technologies: string[];
  links: {
    primary: string;
    source: string;
  };
  copy: Record<SiteLocale, LocalizedProjectCopy>;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'wpmoo',
    featured: false,
    technologies: ['Odoo 19', 'Python', 'PostgreSQL', 'Bootstrap'],
    links: {
      primary: 'https://wpmoo.org',
      source: 'https://github.com/wpmoo-org',
    },
    copy: {
      en: {
        title: 'WPMoo',
        summary: 'A workspace for reusable Odoo products, integrations, and focused business applications.',
        problem: 'Complex Odoo work becomes noisy when product code, customer-specific behavior, and reusable platform capabilities lose their boundaries.',
        role: 'Product architecture, Odoo development, reusable platform contracts, and delivery workflow.',
        result: 'A source-grounded workspace where independently deployable products and project applications can evolve without collapsing into one codebase.',
        status: 'In active development',
      },
      de: {
        title: 'WPMoo',
        summary: 'Ein Workspace für wiederverwendbare Odoo-Produkte, Integrationen und fokussierte Geschäftsanwendungen.',
        problem: 'Komplexe Odoo-Arbeit wird unübersichtlich, wenn Produktcode, projektspezifisches Verhalten und wiederverwendbare Plattformfunktionen ihre Grenzen verlieren.',
        role: 'Produktarchitektur, Odoo-Entwicklung, wiederverwendbare Plattformverträge und Delivery-Workflow.',
        result: 'Ein quellengestützter Workspace, in dem unabhängig deploybare Produkte und Projektanwendungen getrennt weiterentwickelt werden können.',
        status: 'In aktiver Entwicklung',
      },
      tr: {
        title: 'WPMoo',
        summary: 'Yeniden kullanılabilir Odoo ürünleri, entegrasyonlar ve odaklı iş uygulamaları için bir çalışma alanı.',
        problem: 'Ürün kodu, projeye özel davranışlar ve ortak platform yetenekleri sınırlarını kaybettiğinde karmaşık Odoo çalışmaları hızla gürültülü hale gelir.',
        role: 'Ürün mimarisi, Odoo geliştirme, yeniden kullanılabilir platform sözleşmeleri ve teslimat akışı.',
        result: 'Bağımsız dağıtılabilir ürünlerle proje uygulamalarının tek bir kod tabanına dönüşmeden gelişebildiği, kaynak temelli bir çalışma alanı.',
        status: 'Aktif geliştirme',
      },
    },
  },
  {
    slug: 'moo-ui',
    featured: true,
    technologies: ['Bootstrap 5', 'Sass', 'Python', 'JavaScript', 'Astro'],
    links: {
      primary: 'https://ui.wpmoo.org',
      source: 'https://github.com/wpmoo-org/ui',
    },
    copy: {
      en: {
        title: 'Moo UI',
        summary: 'An MIT-licensed, Bootstrap-native component system with a calm shadcn-inspired visual language.',
        problem: 'Server-rendered applications need modern, coherent interfaces without replacing their platform contracts with a frontend framework.',
        role: 'Product direction, component contracts, Sass architecture, browser certification, accessibility, and release engineering.',
        result: 'Published on npm as @wpmoo/ui (v0.5.0) with 40+ Bootstrap-native components: ready-to-use CSS and optional side-effect-free ESM that preserve Bootstrap markup and behavior for server-rendered products.',
        status: 'Open source · Active',
      },
      de: {
        title: 'Moo UI',
        summary: 'Ein MIT-lizenziertes, Bootstrap-natives Komponentensystem mit ruhiger, von shadcn inspirierter Designsprache.',
        problem: 'Serverseitig gerenderte Anwendungen brauchen moderne, konsistente Oberflächen, ohne ihre Plattformverträge durch ein Frontend-Framework zu ersetzen.',
        role: 'Produktausrichtung, Komponentenverträge, Sass-Architektur, Browser-Zertifizierung, Barrierefreiheit und Release Engineering.',
        result: 'Auf npm als @wpmoo/ui (v0.5.0) mit über 40 Bootstrap-nativen Komponenten veröffentlicht: direkt nutzbares CSS und optionales, nebenwirkungsfreies ESM, das Bootstrap-Markup und -Verhalten für serverseitig gerenderte Produkte bewahrt.',
        status: 'Open Source · Aktiv',
      },
      tr: {
        title: 'Moo UI',
        summary: 'Sakin, shadcn esintili bir görsel dile sahip MIT lisanslı, Bootstrap-native bileşen sistemi.',
        problem: 'Server-rendered uygulamalar, platform sözleşmelerini bir frontend framework ile değiştirmeden modern ve tutarlı arayüzlere ihtiyaç duyar.',
        role: 'Ürün yönü, bileşen sözleşmeleri, Sass mimarisi, tarayıcı sertifikasyonu, erişilebilirlik ve release mühendisliği.',
        result: 'npm üzerinde @wpmoo/ui (v0.5.0) olarak, 40’ın üzerinde Bootstrap-native bileşenle yayında: server-rendered ürünlerde Bootstrap markup ve davranışını koruyan kullanıma hazır CSS ile opsiyonel, yan etkisiz ESM.',
        status: 'Açık kaynak · Aktif',
      },
    },
  },
];

// The homepage and /work/ both render this, not portfolioProjects directly,
// so a project only appears once its own `featured` flag is flipped on --
// one gate, not two places to remember to filter.
export const featuredProjects: PortfolioProject[] = portfolioProjects.filter(
  (project) => project.featured,
);
