/** Постоянная публичная страница и её параметры обхода поисковыми роботами. */
interface SitemapRoute {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}

/** Постоянные страницы карты сайта в исходном порядке и с прежними приоритетами. */
export const SITEMAP_ROUTES: SitemapRoute[] = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/orders",
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    path: "/posts",
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    path: "/news",
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    path: "/blog",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/rtn",
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    path: "/rtn/ask",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/nir",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/sudebnaya-ekspertiza",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/kadastrovye-raboty",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/audit-supb",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/ekspertiza-promyshlennoy-bezopasnosti",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/tehnicheskoe-diagnostirovanie",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/proektirovanie",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/ekologiya",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/inzhenernye-izyskaniya",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/reviews",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    path: "/zepb-registry",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/expert-contacts",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/training/defectoscopist-certification",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/requisites",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/offer",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/user-agreement",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/privacy-policy",
    changeFrequency: "yearly",
    priority: 0.3,
  },
];
