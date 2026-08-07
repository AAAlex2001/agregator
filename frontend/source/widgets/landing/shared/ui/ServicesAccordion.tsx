"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChevronIcon } from "@/source/shared/ui/icons";
import s from "./services-accordion.module.scss";

export interface ServicesAccordionItem {
  title: string;
  text: string;
  image: string;
  href?: string;
}

type ServicesAccordionProps = {
  items: ServicesAccordionItem[];
  renderActions?: (item: ServicesAccordionItem) => ReactNode;
  renderVisual?: (item: ServicesAccordionItem) => ReactNode;
  hideItemText?: boolean;
  mobileStack?: boolean;
  initialActiveIndex?: number;
  onSelect?: (item: ServicesAccordionItem, index: number) => void;
};

export function ServicesAccordion({
  items,
  renderActions,
  renderVisual,
  hideItemText,
  mobileStack,
  initialActiveIndex = 0,
  onSelect,
}: ServicesAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [isDesktop, setIsDesktop] = useState(true);
  const active = items[activeIndex];

  useEffect(() => {
    if (!mobileStack) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [mobileStack]);

  const inlineVisual = mobileStack && !isDesktop;

  return (
    <div className={s.panel}>
      <div className={mobileStack ? `${s.grid} ${s.gridStack}` : s.grid}>
        <ul className={s.list}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={item.title} className={isActive ? `${s.item} ${s.itemActive}` : s.item}>
                <button
                  type="button"
                  className={s.head}
                  onClick={() => {
                    setActiveIndex(index);
                    onSelect?.(item, index);
                  }}
                  aria-expanded={isActive}
                >
                  <span className={s.num}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={s.itemTitle}>{item.title}</span>
                  <ChevronIcon className={s.chevron} color="currentColor" />
                </button>
                {isActive && (!hideItemText || inlineVisual) && (
                  <div className={s.body}>
                    {!hideItemText && <p className={s.desc}>{item.text}</p>}
                    {inlineVisual && (
                      <div className={s.inlineVisual}>
                        {renderVisual?.(item)}
                        {renderActions?.(item)}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {!inlineVisual && (
          <div className={s.right}>
            {renderVisual ? (
              renderVisual(active)
            ) : (
              <div className={s.visual}>
                <Image
                  key={active.image}
                  src={active.image}
                  alt={active.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 720px"
                  className={s.visualImg}
                />
              </div>
            )}
            {renderActions?.(active)}
          </div>
        )}
      </div>

      {!mobileStack && (
        <Swiper className={s.slider} slidesPerView={1.1} spaceBetween={12}>
          {items.map((item) => (
            <SwiperSlide key={item.title} className={s.slide}>
              <div className={s.slideImage}>
                <Image src={item.image} alt={item.title} fill sizes="90vw" className={s.slideImg} />
              </div>
              <div className={s.slideBody}>
                <h3 className={s.slideTitle}>{item.title}</h3>
                <p className={s.slideDesc}>{item.text}</p>
                {renderActions && <div className={s.slideActions}>{renderActions(item)}</div>}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
