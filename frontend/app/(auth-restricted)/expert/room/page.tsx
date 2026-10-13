"use client";

import { RoleGuard } from "@/source/entities/session";
import { ExpertRoomWidget } from "@/source/widgets/expert-room";

export default function ExpertRoomPage() {
  return (
    <RoleGuard allowed={["EXPERT"]}>
      <ExpertRoomWidget />
    </RoleGuard>
  );
}
