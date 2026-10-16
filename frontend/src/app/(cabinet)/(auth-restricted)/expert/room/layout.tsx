import type { ReactNode } from "react";
import { ExpertRoomLayout } from "@/widgets/expert-room";

/** Страница чата исполнителей. */
interface ExpertRoomRouteLayoutProps {
  children: ReactNode;
}

/** Растягивает чат исполнителей на свободную высоту кабинета. */
export default function ExpertRoomRouteLayout({ children }: ExpertRoomRouteLayoutProps) {
  return <ExpertRoomLayout>{children}</ExpertRoomLayout>;
}
