"use client";

import { RoleGuard } from "@/source/entities/session";
import { ExpertReviewsWidget } from "@/source/widgets/expert-reviews";

export default function ExpertReviewsPage() {
  return (
    <RoleGuard allowed={["EXPERT"]}>
      <ExpertReviewsWidget />
    </RoleGuard>
  );
}
