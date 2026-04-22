"use client";

import { useParams } from "next/navigation";
import { ExpertReviewsWidget } from "@/source/widgets/expert-reviews";

export default function ExpertReviewsByIdPage() {
  const params = useParams<{ publicId: string }>();
  const publicId = Array.isArray(params.publicId) ? params.publicId[0] : params.publicId;

  return publicId ? <ExpertReviewsWidget publicId={publicId} /> : null;
}
