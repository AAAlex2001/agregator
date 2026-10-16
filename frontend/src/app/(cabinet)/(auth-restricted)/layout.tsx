import type { ReactNode } from "react";
import { PRIVATE_SECTION_METADATA } from "../../seo/private-page";
import { AuthenticationRequired } from "../../ui/authentication-required";
import { NotificationIntroduction } from "../../ui/notification-introduction";

export const metadata = PRIVATE_SECTION_METADATA;

/** Содержимое закрытого раздела кабинета. */
interface PrivateLayoutProps {
  children: ReactNode;
}

/** Защищает личные страницы и сохраняет их запрет индексации. */
export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <AuthenticationRequired>
      {children}
      <NotificationIntroduction />
    </AuthenticationRequired>
  );
}
