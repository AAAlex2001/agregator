"use client";

import { usePathname } from "next/navigation";
import LandingFooter from "@/source/widgets/landing/ui/Footer";

const SKIP_ROUTES = [/^\/$/, /^\/landing(?:\/.*)?$/];

export function LayoutFooter() {
  const pathname = usePathname();
  if (SKIP_ROUTES.some((pattern) => pattern.test(pathname))) {
    return null;
  }
  return <LandingFooter variant="light" />;
}
