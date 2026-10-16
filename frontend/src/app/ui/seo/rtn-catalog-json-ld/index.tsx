import type { RtnListItem } from "@/entities/rtn";
import { SITE_URL } from "@/shared/config/site";
import { JsonLd } from "../json-ld";

/** Разъяснения, вошедшие в серверную выдачу публичного каталога. */
interface RtnCatalogJsonLdProps {
  items: RtnListItem[];
}

/** Добавляет в HTML структурированный список разъяснений и хлебные крошки. */
export function RtnCatalogJsonLd({ items }: RtnCatalogJsonLdProps) {
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ростехнадзор отвечает: база официальных ответов",
    url: `${SITE_URL}/rtn`,
    isPartOf: {
      "@type": "WebSite",
      name: "Ресурс-Плюс",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/rtn/${item.slug}`,
        name: item.title,
      })),
    },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ростехнадзор отвечает",
        item: `${SITE_URL}/rtn`,
      },
    ],
  };

  return (
    <>
      <JsonLd json={JSON.stringify(collection)} />
      <JsonLd json={JSON.stringify(breadcrumbs)} />
    </>
  );
}
