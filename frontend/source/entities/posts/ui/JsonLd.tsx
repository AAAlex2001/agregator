import { SITE_URL } from "@/source/shared/api/config";

interface Crumb {
  name: string;
  url: string;
}

/** Хлебные крошки для поисковиков: Главная → Публикации → текущая страница. */
export function breadcrumbs(current: Crumb) {
  const crumbs = [
    { name: "Главная", url: SITE_URL },
    { name: "Публикации", url: `${SITE_URL}/posts` },
    current,
  ];

  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/** Разметка schema.org в теге script. */
export function JsonLd({ graph }: { graph: object[] }) {
  const data = { "@context": "https://schema.org", "@graph": graph };
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
