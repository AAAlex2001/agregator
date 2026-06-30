"use client";

import { type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { useSession } from "@/source/features/session";
import { LicenseHolderCard, useLicenseHolders } from "@/source/entities/license-holder";
import Loader from "@/source/shared/ui/Loader";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { getReviewLinks } from "@/source/widgets/reviews-hub";
import { getUsefulLinks } from "@/source/widgets/useful-links";
import { EXPERT_HELP_LINKS } from "../model/links";
import s from "./ExpertHelpPlates.module.scss";

type Color = "green" | "orange" | "blue" | "purple";

interface CardLink {
  href: string;
  label: string;
  description: string;
  Icon: ComponentType<{ className?: string; color?: string }>;
}

function Plate({ color, label, children }: { color: Color; label: string; children: ReactNode }) {
  return (
    <div className={`${s.plateWrap} ${s[color]}`}>
      <button type="button" className={s.plate}>
        <span className={s.plateLabel}>{label}</span>
        <ChevronIcon className={s.chevron} color="currentColor" />
      </button>
      <div className={s.dropdown}>
        <div className={s.panel}>{children}</div>
      </div>
    </div>
  );
}

function LinkCards({ links, external }: { links: CardLink[]; external?: boolean }) {
  return (
    <div className={s.list}>
      {links.map(({ href, label, description, Icon }) => {
        const inner = (
          <>
            <span className={s.cardIcon}>
              <Icon color="currentColor" />
            </span>
            <span className={s.cardText}>
              <span className={s.cardLabel}>{label}</span>
              <span className={s.cardDesc}>{description}</span>
            </span>
          </>
        );
        return external ? (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={s.card}>
            {inner}
          </a>
        ) : (
          <Link key={href} href={href} className={s.card}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

function LicensePlate() {
  const { items, isLoading, error } = useLicenseHolders(true);
  return (
    <Plate color="orange" label="Держатели лицензии">
      {isLoading ? (
        <div className={s.loading}>
          <Loader size="sm" label="" />
        </div>
      ) : error ? (
        <p className={s.message}>{error}</p>
      ) : items.length === 0 ? (
        <p className={s.message}>Пока нет зарегистрированных держателей лицензии.</p>
      ) : (
        <div className={s.list}>
          {items.map((item) => (
            <LicenseHolderCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </Plate>
  );
}

export function ExpertHelpPlates() {
  const { role } = useSession();

  if (role !== "EXPERT" && role !== "CUSTOMER") return null;

  const reviewLinks = getReviewLinks(role);
  const usefulLinks = getUsefulLinks(role);

  return (
    <div className={s.plates}>
      {role === "EXPERT" && (
        <>
          <Plate color="green" label="Помощь эксперту">
            <LinkCards links={EXPERT_HELP_LINKS} />
          </Plate>
          <LicensePlate />
        </>
      )}

      <Plate color="blue" label="Все отзывы">
        <LinkCards links={reviewLinks} />
      </Plate>

      {usefulLinks.length > 0 && (
        <Plate color="purple" label="Полезные ссылки">
          <LinkCards links={usefulLinks} external />
        </Plate>
      )}
    </div>
  );
}
