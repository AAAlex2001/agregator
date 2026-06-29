import type { ComponentType } from "react";
import { ExpertIcon, ReviewIcon, ReviewStarIcon } from "@/source/shared/ui/icons";

export interface ReviewLink {
  href: string;
  label: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
}

export function getReviewLinks(role: string | null): ReviewLink[] {
  const links: ReviewLink[] = [
    {
      href: "/landing/reviews",
      label: "Отзывы о нас",
      description: "Что клиенты говорят о площадке",
      Icon: ReviewIcon,
    },
  ];

  if (role === "EXPERT") {
    links.push({
      href: "/expert/reviews",
      label: "Мои отзывы",
      description: "Отзывы, оставленные о вас",
      Icon: ReviewStarIcon,
    });
  }

  links.push({
    href: "/expert-reviews",
    label: "Отзывы экспертов",
    description: "Отзывы и рейтинги экспертов площадки",
    Icon: ExpertIcon,
  });

  return links;
}
