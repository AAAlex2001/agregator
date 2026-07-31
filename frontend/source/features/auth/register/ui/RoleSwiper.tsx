"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { BulletIcon } from "@/source/shared/ui/icons";
import type { Role } from "../model/types";
import s from "./RoleSwiper.module.scss";

interface Props {
  roles: Role[];
  onSelectRole: (id: number) => void;
}

export function RoleSwiper({ roles, onSelectRole }: Props) {
  return (
    <div className={s.wrap}>
      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
        spaceBetween={12}
        navigation={{ prevEl: ".role-nav--prev", nextEl: ".role-nav--next" }}
        className={`${s.swiper} role-swiper`}
      >
        {roles.map((role) => (
          <SwiperSlide key={role.id} className={s.slide}>
            <article className={s.card}>
              {role.photo && (
                <div className={s.image}>
                  <Image src={role.photo} alt="" fill sizes="440px" style={{ objectFit: "cover" }} />
                </div>
              )}
              <div className={s.content}>
                <div className={s.head}>
                  <span className={s.icon}>{role.icon}</span>
                  <div className={s.titleWrap}>
                    <Title as="h3" text={role.title} className={s.title} />
                    {role.subtitle && <span className={s.subtitle}>{role.subtitle}</span>}
                  </div>
                </div>

                <Subtitle text={role.expandedTitle} className={s.expandedTitle} />

                <ul className={s.list}>
                  {role.description.map((item) => (
                    <li key={item} className={s.item}>
                      <span className={s.bullet}>
                        <BulletIcon />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outlineOrange"
                  fullWidth
                  className={s.selectButton}
                  onClick={() => onSelectRole(role.id)}
                >
                  Выбрать
                </Button>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
