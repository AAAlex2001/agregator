"use client";

import styles from "./how-it-works.module.scss";
import { useState } from "react";
import Image from "next/image";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";

import type { LandingStep } from "../model/landing.data";

type HowItWorksProps = {
  clientSteps: LandingStep[];
  expertSteps: LandingStep[];
};

const HowItWorks = ({ clientSteps, expertSteps }: HowItWorksProps) => {

    const [isExpert, setIsExpert] = useState(false);

  return (
    <section className={styles.section} id="how-it-works">
        <div className={styles.content}>
            <div className={styles.header}>
                <div className={styles.backgroundImage}>
        <Image src="/belaz.svg" alt="Industry background" fill style={{ objectFit: "contain" }} />
      </div>

                <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>

                <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>

                <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>

                <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>

                <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>

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
                    </div>
                  </div>
                ))}
              </div>
                    </div>
            </div>
    </section>
  );
};

export default HowItWorks;

