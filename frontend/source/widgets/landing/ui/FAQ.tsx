"use client";

import { useState } from "react";
import s from "./faq.module.scss";
import Image from "next/image";
import Accordion from "@/source/shared/ui/Accordion";
import { Title, Subtitle } from "@/source/shared/ui/Typography";

import type { LandingFaqItem } from "../model/landing.data";
type FAQProps = {
  items: LandingFaqItem[];
};

const FAQ = ({ items }: FAQProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={s.section} id="faq">
      <div className={s.content}>
        <div className={s.header}>
          <div className={s.backgroundImageCoal}>
            <Image
              src="/coal.svg"
              alt="coal"
              fill
              unoptimized
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className={s.backgroundImageCoal}>
            <Image
              src="/gold.svg"
              alt="gold"
              fill
              unoptimized
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className={s.backgroundImageCoal}>
            <Image
              src="/copper.svg"
              alt="cooper"
              fill
              unoptimized
              style={{ objectFit: "contain" }}
            />
          </div>
          <Title text="Частые вопросы" />
          <Subtitle text="Всё, что важно знать перед началом работы" />
        </div>

        <Accordion items={items} activeId={activeId} onToggle={toggle} />
      </div>
    </section>
  );
};

export default FAQ;
