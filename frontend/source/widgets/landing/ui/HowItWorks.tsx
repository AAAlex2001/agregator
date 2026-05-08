"use client";

import s from "./how-it-works.module.scss";
import { useState } from "react";
import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";

import type { LandingStep } from "../model/landing.data";

type HowItWorksProps = {
  clientSteps: LandingStep[];
  expertSteps: LandingStep[];
  title: string;
  subtitle: string;
};

const HowItWorks = ({ clientSteps, expertSteps, title, subtitle }: HowItWorksProps) => {

    const [isExpert, setIsExpert] = useState(false);

  return (
      <section className={s.section} id="how-it-works">
    <div className={s.content}>
        <div className={s.header}>
      <div className={s.backgroundImage}>
    <Image src="/belaz.webp" alt="" aria-hidden="true" fill sizes="630px" style={{ objectFit: "contain" }} />
      </div>

      <div className={s.backgroundImageCoal}>
    <Image src="/coal.webp" alt="" aria-hidden="true" fill sizes="246px" style={{ objectFit: "contain" }} />
      </div>

      <div className={s.backgroundImageCoal}>
    <Image src="/coal.webp" alt="" aria-hidden="true" fill sizes="246px" style={{ objectFit: "contain" }} />
      </div>

      <div className={s.backgroundImageCoal}>
    <Image src="/coal.webp" alt="" aria-hidden="true" fill sizes="246px" style={{ objectFit: "contain" }} />
      </div>

      <div className={s.backgroundImageCoal}>
    <Image src="/coal.webp" alt="" aria-hidden="true" fill sizes="246px" style={{ objectFit: "contain" }} />
      </div>

      <div className={s.backgroundImageCoal}>
    <Image src="/coal.webp" alt="" aria-hidden="true" fill sizes="246px" style={{ objectFit: "contain" }} />
      </div>

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
                    </div>
                  </div>
                ))}
              </div>
              <Button href="/register" variant="secondary" className={s.ctaButton}>
                Зарегистрироваться
              </Button>
                    </div>
            </div>
    </section>
  );
};

export default HowItWorks;

