import { SessionProvider } from "@/source/features/session";
import PromoBanner from "@/source/widgets/landing/ui/PromoBanner";
import s from "./layout.module.scss";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <div className={s.promo}>
        <PromoBanner />
      </div>
      <div className={s.spacer} aria-hidden="true" />
      {children}
    </SessionProvider>
  );
}
