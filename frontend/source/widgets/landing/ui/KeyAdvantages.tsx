"use client"

import s from "./key-advantages.module.scss";
import { useState } from "react";
import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";

import type { LandingStep } from "../model/landing.data";

type KeyAdvantagesProps = {
  clientSteps: LandingStep[];
  expertSteps: LandingStep[];
  title: string;
  subtitle: string;
};

const KeyAdvantages = ({ clientSteps, expertSteps, title, subtitle }: KeyAdvantagesProps) => {

    const [isExpert, setIsExpert] = useState(false);

  return (
    <section className={s.section} id="key-advantages">
      <div className={s.content}>
        <div className={s.header}>
            <Title text={title} />
            <Subtitle text={subtitle} />
            </div>
          <div className={s.stepsInfo}>
                        <Tabs
                          tabs={[
                            { id: 'client', label: 'Я заказчик' },
                            { id: 'expert', label: 'Я эксперт' }
                          ]}
                          activeTab={isExpert ? 'expert' : 'client'}
                          onTabChange={(tabId) => setIsExpert(tabId === 'expert')}
                        />
              <div className={s.steps}>
                {(isExpert ? expertSteps : clientSteps).map((value) => (
                  <div className={s.step} key={`${isExpert ? 'expert' : 'client'}-${value.id}`}>
                    <div className={s.iconWrapper}>
                      <img src={value.icon} alt={value.title} loading="lazy" decoding="async" />
                    </div>
                    <div className={s.description}>
                      <h3>{value.title}</h3>
                      <p>{value.description}</p>
                      {value.subDescription && (
                        <span className={s.subDescription}>{value.subDescription}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button href="/register" variant="secondary" className={s.ctaButton}>
                Смотреть все преимущества
              </Button>
                    </div>
            </div>
      <div className={s.backgroundImage}>
        <Image src="/key-advantages.webp" alt="" aria-hidden="true" fill sizes="100vw" style={{ objectFit: "cover"  }} />
      </div>
    </section>
  );
};

export default KeyAdvantages;

