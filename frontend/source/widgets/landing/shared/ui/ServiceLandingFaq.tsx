"use client";

import { useState } from "react";
import Image from "next/image";
import Accordion from "@/source/shared/ui/Accordion";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./service-landing-faq.module.scss";

export interface ServiceLandingFaqItem {
  id: string;
  question: string;
  answer: string;
}

type ServiceLandingFaqProps = {
  items: ServiceLandingFaqItem[];
  subtitle: string;
  title?: string;
  decoration?: boolean;
};

const DECORATION = [
  { src: "/coal.webp", sizes: "246px" },
  { src: "/gold.webp", sizes: "486px" },
  { src: "/copper.webp", sizes: "390px" },
];

export function ServiceLandingFaq({
  items,
  subtitle,
  title = "Частые вопросы",
  decoration = false,
}: ServiceLandingFaqProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className={s.section} id="faq">
      <div className={s.content}>
        <header className={s.header}>
          {decoration &&
            DECORATION.map((item) => (
              <div key={item.src} className={s.decoration}>
                <Image
                  src={item.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes={item.sizes}
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          <Title text={title} as="h2" />
          <Subtitle text={subtitle} />
        </header>

        <Accordion
          items={items}
          activeId={activeId}
          onToggle={(id) => setActiveId((prev) => (prev === id ? null : id))}
        />
      </div>
    </section>
  );
}
