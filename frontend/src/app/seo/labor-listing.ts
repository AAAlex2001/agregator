import type { Metadata } from "next";
import {
  getLaborEmploymentText,
  getLaborKindLabel,
  getLaborRequirementText,
} from "@/entities/labor";
import type { LaborListing } from "@/entities/labor";
import { createPrivateMetadata } from "./private-page";

/** Заголовок ссылки: вид объявления и требования к исполнителю. */
function createTitle(item: LaborListing): string {
  const kind = getLaborKindLabel(item);
  const requirement = getLaborRequirementText(item);

  return requirement ? `${kind} · ${requirement}` : kind;
}

/** Описание ссылки: регион и срок трудоустройства. */
function createDescription(item: LaborListing): string {
  return [item.region, getLaborEmploymentText(item)]
    .filter(Boolean)
    .join(" · ");
}

/** Даёт карточку ссылки на объявление, не открывая его для индексации. */
export function createLaborListingMetadata(
  publicId: string,
  item: LaborListing | null,
): Metadata {
  if (!item) {
    return createPrivateMetadata("Заявка не найдена");
  }

  const title = createTitle(item);
  const description = createDescription(item);
  const path = `/labor/listing/${publicId}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: "Ресурс-Плюс",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-default.png"],
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}
