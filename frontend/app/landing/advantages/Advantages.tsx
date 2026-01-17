"use client";

import styles from "./advantages.module.scss";
import { useState } from "react";
import { Card } from "@/app/components";
import { DiplomaIcon, QuickIcon, SearchIcon, CommentIcon } from "@/app/icons";

import type { AdvantageIconKey, LandingAdvantage } from "../landing.data";

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
    <section className={styles.section} id="advantages">
      <div className={styles.card}>
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