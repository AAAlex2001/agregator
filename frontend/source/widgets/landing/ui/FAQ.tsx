"use client";

import { useState } from "react";
import s from "./faq.module.scss";
import Image from "next/image";
import Accordion from "@/source/shared/ui/Accordion";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import SeoText from "./SeoText";

import type { LandingFaqItem } from "../model/landing.data";
type FAQProps = {
  items: LandingFaqItem[];
  title: string;
  subtitle: string;
};

const FAQ = ({ items, title, subtitle }: FAQProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <section className={s.section} id="faq">
        <div className={s.content}>
          <div className={s.header}>
            <div className={s.backgroundImageCoal}>
              <Image
                src="/coal.webp"
                alt=""
                aria-hidden="true"
                fill
                sizes="246px"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={s.backgroundImageCoal}>
              <Image
                src="/gold.webp"
                alt=""
                aria-hidden="true"
                fill
                sizes="486px"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={s.backgroundImageCoal}>
              <Image
                src="/copper.webp"
                alt=""
                aria-hidden="true"
                fill
                sizes="390px"
                style={{ objectFit: "contain" }}
              />
            </div>
            <Title text={title} />
            <Subtitle text={subtitle} />
          </div>

          <Accordion items={items} activeId={activeId} onToggle={toggle} />
        </div>
      </section>
      <SeoText />
    </>
  );
};

export default FAQ;
