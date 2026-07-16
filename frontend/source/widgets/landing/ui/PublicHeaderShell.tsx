"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  className: string;
  hiddenClassName: string;
  children: ReactNode;
}

export default function PublicHeaderShell({
  className,
  hiddenClassName,
  children,
}: Props) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 8) {
        setIsHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(scrollDelta) < 6) return;

      setIsHidden(scrollDelta > 0);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${className} ${isHidden ? hiddenClassName : ""}`}>
      {children}
    </header>
  );
}
