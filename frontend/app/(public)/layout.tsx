import { SessionProvider } from "@/source/features/session";
import { AuthModalProvider } from "@/source/shared/lib/auth-modal";
import { AuthModalHost } from "@/source/widgets/auth/auth-modal";
import { ScrollToTop } from "@/source/shared/ui/ScrollToTop";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <AuthModalProvider>
        {children}
        <AuthModalHost />
        <ScrollToTop />
      </AuthModalProvider>
    </SessionProvider>
  );
}
