import type { ComponentType } from "react";
import { ReviewsAboutIcon, ReviewsExpertsIcon, ReviewsMineIcon } from "@/source/shared/ui/icons";

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
      Icon: ReviewsAboutIcon,
    },
  ];

  if (role === "EXPERT") {
    links.push({
      href: "/expert/reviews",
      label: "Мои отзывы",
      description: "Отзывы, оставленные о вас",
      Icon: ReviewsMineIcon,
    });
  }

  links.push({
    href: "/expert-reviews",
    label: "Отзывы экспертов",
    description: "Отзывы и рейтинги экспертов площадки",
    Icon: ReviewsExpertsIcon,
  });

  return links;
}
