import { ScrollToTop } from "@/source/shared/ui/ScrollToTop";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ScrollToTop />
    </>
  );
}
