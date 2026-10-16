"use client";

import { useUser } from "@/entities/user";
import { ExpertRoomChat } from "../expert-room-chat";
import { ExpertRoomSkeleton } from "../expert-room-skeleton";

/** Открывает чат исполнителей после загрузки профиля; новый аккаунт получает новый чат. */
export function ExpertRoom() {
  const { user } = useUser();

  if (!user) {
    return <ExpertRoomSkeleton />;
  }

  return (
    <ExpertRoomChat
      key={user.id}
      currentUserId={user.id}
    />
  );
}
