"use client"

import styles from "./key-advantages.module.scss";
import { useState } from "react";
import Image from "next/image";
import { Tabs, Title, Subtitle } from "@/app/components";

import type { LandingStep } from "../landing.data";

type KeyAdvantagesProps = {
  clientSteps: LandingStep[];
  expertSteps: LandingStep[];
};

const KeyAdvantages = ({ clientSteps, expertSteps }: KeyAdvantagesProps) => {

    const [isExpert, setIsExpert] = useState(false);

  return (
    <section className={styles.section} id="key-advantages">
        <div className={styles.content}>
            <div className={styles.header}>
            <Title text="Начните работать за 4 простых шага" />
            <Subtitle text="Платформа устроена максимально прозрачно. Выбирайте свою роль:" />
            </div>
                <div className={styles.stepsInfo}>
                        <Tabs
                          tabs={[
                            { id: 'client', label: 'Я заказчик' },
                            { id: 'expert', label: 'Я эксперт' }
                          ]}
                          activeTab={isExpert ? 'expert' : 'client'}
                          onTabChange={(tabId) => setIsExpert(tabId === 'expert')}
                        />
              <div className={styles.steps}>
                {(isExpert ? expertSteps : clientSteps).map((value) => (
                  <div className={styles.step} key={`${isExpert ? 'expert' : 'client'}-${value.id}`}>
                    <div className={styles.iconWrapper}>
                      <img src={value.icon} alt={value.title} />
                    </div>
                    <div className={styles.description}>
                      <h3>{value.title}</h3>
                      <p>{value.description}</p>
                      {value.subDesription && (
                        <span className={styles.subDescription}>{value.subDesription}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
                    </div>
            </div>
      <div className={styles.backgroundImage}>
        <Image src="/key-advantages.png" alt="Key advantages background" fill style={{ objectFit: "cover"  }} />
      </div>
    </section>
  );
};

export default KeyAdvantages;

