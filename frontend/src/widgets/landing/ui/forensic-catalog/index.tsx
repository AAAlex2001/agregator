"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Tabs } from "@/shared/ui/tabs";
import {
  FORENSIC_GROUPS,
  FORENSIC_LABOUR_SAFETY,
} from "../../config/forensic";
import { ForensicCatalogLink } from "../forensic-catalog-link";
import { ServiceSection } from "../service-section";
import styles from "./style.module.scss";

/** Переключает группы судебных исследований и показывает ссылки на их описания. */
export function ForensicCatalog() {
  const [activeTab, setActiveTab] = useState(FORENSIC_GROUPS[0].id);
  const group = FORENSIC_GROUPS.find((item) => item.id === activeTab)
    ?? FORENSIC_GROUPS[0];
  const tabs = FORENSIC_GROUPS.map((item, index) => ({
    id: item.id,
    label: `${index + 1}. ${item.tab}`,
  }));

  return (
    <ServiceSection
      id="vidy-ekspertiz"
      title="Виды судебной экспертизы"
      subtitle="Выберите направление — внутри собраны конкретные виды исследований и рецензии на заключения."
    >
      <Tabs
        variant="squared"
        className={styles.tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      <div className={styles.panel}>
        <div className={styles.groupHead}>
          <div className={styles.groupText}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <p className={styles.groupDesc}>{group.description}</p>
          </div>
          <Button
            href={group.href}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="md"
            showArrow
            className={styles.groupBtn}
          >
            Подробнее о направлении
          </Button>
        </div>

        <ul className={styles.grid}>
          {group.items.map((item, index) => (
            <ForensicCatalogLink
              key={item.label}
              item={item}
              index={index}
            />
          ))}
        </ul>

        <div className={styles.safety}>
          <h3 className={styles.safetyTitle}>{FORENSIC_LABOUR_SAFETY.title}</h3>
          <p className={styles.safetyDesc}>{FORENSIC_LABOUR_SAFETY.description}</p>
        </div>
      </div>
    </ServiceSection>
  );
}
