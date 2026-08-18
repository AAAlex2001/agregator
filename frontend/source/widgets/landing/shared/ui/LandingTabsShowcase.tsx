"use client";

import { useState, type ReactNode } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import s from "./landing-tabs-showcase.module.scss";

export interface LandingTabsPanelItem {
  tab: string;
  title: string;
  text: string;
  image: string;
}

type Props<T extends { tab: string }> = {
  items: T[];
  renderPanel: (item: T) => ReactNode;
};

export function LandingTabsShowcase<T extends { tab: string }>({ items, renderPanel }: Props<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] ?? items[0];

  return (
    <>
      <Tabs
        variant="squared"
        className={s.tabs}
        activeTab={String(activeIndex)}
        onTabChange={(id) => setActiveIndex(Number(id))}
        tabs={items.map((item, index) => ({
          id: String(index),
          label: `${index + 1}. ${item.tab}`,
        }))}
      />
      <div className={s.panel}>{renderPanel(active)}</div>
    </>
  );
}
