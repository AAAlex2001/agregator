"use client";

import s from "./advantages.module.scss";
import { useState } from "react";
import Card from "@/source/shared/ui/Card";
import { CommentIcon, DiplomaIcon, QuickIcon, SearchIcon } from "@/source/shared/ui/icons";

import type { AdvantageIconKey, LandingAdvantage } from "../model/landing.data";

type AdvantagesProps = {
  features: LandingAdvantage[];
};

function renderIcon(iconKey: AdvantageIconKey) {
  switch (iconKey) {
    case "diploma":
      return <DiplomaIcon size={40} />;
    case "quick":
      return <QuickIcon size={40} />;
    case "search":
      return <SearchIcon size={40} />;
    case "comment":
      return <CommentIcon size={40} />;
  }
}

const Advantages = ({ features }: AdvantagesProps) => {
  const [openedCards, setOpenedCards] = useState<Set<number>>(new Set());

  const toggleCard = (id: number) => {
    setOpenedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className={s.section} id="advantages">
      <div className={s.card}>
        {features.map((feature) => {
          const isOpen = openedCards.has(feature.id);
          return (
            <Card
              key={feature.id}
              variant="advantage"
              title={feature.title}
              description={feature.description}
              icon={renderIcon(feature.iconKey)}
              photo={feature.photo}
              isOpen={isOpen}
              onClick={() => toggleCard(feature.id)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Advantages;