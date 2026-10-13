import { SITE_URL } from "@/source/shared/api/config";
import { postUrl } from "../lib/postSeo";
import type { Post } from "../model/types";
import { breadcrumbs, JsonLd } from "./JsonLd";

interface FeedJsonLdProps {
  title: string;
  path: string;
  posts: Post[];
}

/** Разметка для поисковиков: лента как страница-подборка со списком оригиналов публикаций. */
export function FeedJsonLd({ title, path, posts }: FeedJsonLdProps) {
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
        url: postUrl(post.id),
      })),
    },
  };
  const crumbs = breadcrumbs({ name: title, url });

  return <JsonLd graph={[collection, crumbs]} />;
}
