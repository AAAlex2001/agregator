import type { Post } from "@/entities/post";
import { SITE_URL } from "@/shared/config/site";
import { JsonLd } from "../json-ld";

/** Заголовок, адрес и публикации ленты для поисковой разметки. */
interface PostsFeedJsonLdProps {
  title: string;
  path: string;
  posts: Post[];
}

/** Добавляет ленту как подборку оригиналов публикаций и хлебные крошки раздела. */
export function PostsFeedJsonLd({
  title,
  path,
  posts,
}: PostsFeedJsonLdProps) {
  const url = `${SITE_URL}${path}`;
  const originals = posts.filter((post) => !post.repost_of);

  const collection = {
    "@type": "CollectionPage",
    name: title,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: originals.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/posts/${post.id}`,
      })),
    },
  };
  const breadcrumbs = {
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
        name: "Публикации",
        item: `${SITE_URL}/posts`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
      },
    ],
  };
  const data = {
    "@context": "https://schema.org",
    "@graph": [collection, breadcrumbs],
  };

  return <JsonLd json={JSON.stringify(data)} />;
}
