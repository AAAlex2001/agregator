"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/source/features/session";
import { ChevronIcon, LogoIcon, TechExpertLogoIcon } from "@/source/shared/ui/icons";
import { getCabinetNav, type NavItem } from "@/source/widgets/expert-help";
import s from "./cabinet-burger.module.scss";

function BurgerItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const inner = (
    <>
      <span className={s.subHead}>
        <span className={s.subLabel}>{item.label}</span>
        {item.soon && <span className={s.soon}>в&nbsp;процессе</span>}
      </span>
      {item.description && <span className={s.subDesc}>{item.description}</span>}
    </>
  );

  if (item.soon || !item.href) {
    return <span className={`${s.subLink} ${s.subMuted}`}>{inner}</span>;
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={s.subLink}
        onClick={onNavigate}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href} className={s.subLink} onClick={onNavigate}>
      {inner}
    </Link>
  );
}

function BurgerRegionsItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.regionsWrap}>
      <button
        type="button"
        className={s.regionsToggle}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className={s.subHead}>
          <span className={s.subLabel}>{item.label}</span>
        </span>
        <ChevronIcon className={`${s.chevron} ${open ? s.chevronOpen : ""}`} color="currentColor" />
      </button>
      {open && (
        <div className={s.regions}>
          {(item.regions ?? []).map((group) => (
            <div key={group.region} className={s.region}>
              <span className={s.regionName}>{group.region}</span>
              {group.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.regionLink}
                  onClick={onNavigate}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CabinetBurgerMenu() {
  const { role } = useSession();
  const [open, setOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setOpenKey(null);
  };

  const toggle = (key: string) => setOpenKey((prev) => (prev === key ? null : key));

  const plates =
    role === "EXPERT" || role === "CUSTOMER" || role === "LICENSE_HOLDER"
      ? getCabinetNav(role).filter((p) => p.dynamic !== "license")
      : [];

  return (
    <>
      <button
        type="button"
        className={`${s.burger} ${open ? s.open : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Меню"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <nav className={s.menu}>
          <div className={s.menuLogo}>
            <LogoIcon />
          </div>

          {plates.map((plate) => (
            <div key={plate.key} className={s.group}>
              {plate.href ? (
                <Link
                  href={plate.href}
                  className={`${s.groupHead} ${s.logoHead}`}
                  aria-label={plate.label}
                  onClick={close}
                >
                  {plate.logo ? <TechExpertLogoIcon title={plate.label} width={160} height={38} /> : plate.label}
                </Link>
              ) : (
                <button
                  type="button"
                  className={`${s.groupHead} ${openKey === plate.key ? `${s.groupOpen} ${s[plate.color]}` : ""}`}
                  onClick={() => toggle(plate.key)}
                  aria-expanded={openKey === plate.key}
                >
                  {plate.label}
                  <ChevronIcon className={s.chevron} color="currentColor" />
                </button>
              )}
              {openKey === plate.key && (
                <div className={s.groupBody}>
                  {(plate.items ?? []).map((item) =>
                    item.regions ? (
                      <BurgerRegionsItem key={item.label} item={item} onNavigate={close} />
                    ) : (
                      <BurgerItem key={item.label} item={item} onNavigate={close} />
                    ),
                  )}
                </div>
              )}
            </div>
          ))}

          <div className={s.group}>
            <Link href="/landing/news" className={s.groupHead} onClick={close}>
              Новости
            </Link>
          </div>
          <div className={s.group}>
            <Link href="/landing/blog" className={s.groupHead} onClick={close}>
              Блог
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}

export default CabinetBurgerMenu;
