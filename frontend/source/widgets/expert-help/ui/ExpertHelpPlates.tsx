"use client";

import Link from "next/link";
import { useSession } from "@/source/features/session";
import { LicenseHolderCard, useLicenseHolders } from "@/source/entities/license-holder";
import Loader from "@/source/shared/ui/Loader";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { getCabinetNav, type NavItem, type NavPlate } from "../model/navConfig";
import s from "./ExpertHelpPlates.module.scss";

function ItemRow({ item }: { item: NavItem }) {
  const inner = (
    <>
      <span className={s.itemHead}>
        <span className={s.itemLabel}>{item.label}</span>
        {item.soon && <span className={s.soon}>в&nbsp;процессе</span>}
      </span>
      {item.description && <span className={s.itemDesc}>{item.description}</span>}
    </>
  );

  if (item.soon || !item.href) {
    return <span className={`${s.item} ${s.itemMuted}`}>{inner}</span>;
  }

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={s.item}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href} className={s.item}>
      {inner}
    </Link>
  );
}

function LicenseList() {
  const { items, isLoading, error } = useLicenseHolders(true);

  if (isLoading) {
    return (
      <div className={s.loading}>
        <Loader size="sm" label="" />
      </div>
    );
  }
  if (error) {
    return <p className={s.message}>{error}</p>;
  }
  if (items.length === 0) {
    return <p className={s.message}>Пока нет зарегистрированных держателей лицензии.</p>;
  }
  return (
    <div className={s.list}>
      {items.map((item) => (
        <LicenseHolderCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function PlateNode({ plate, align }: { plate: NavPlate; align: "left" | "right" }) {
  if (plate.href) {
    return (
      <Link href={plate.href} className={`${s.linkPlate} ${s[plate.color]}`}>
        {plate.label}
      </Link>
    );
  }

  return (
    <div className={`${s.plateWrap} ${s[plate.color]}`}>
      <button type="button" className={s.plate}>
        <span className={s.plateLabel}>{plate.label}</span>
        <ChevronIcon className={s.chevron} color="currentColor" />
      </button>
      <div className={`${s.dropdown} ${align === "right" ? s.dropRight : ""}`}>
        <div className={s.panel}>
          {plate.dynamic === "license" ? (
            <LicenseList />
          ) : (
            <div className={s.list}>
              {(plate.items ?? []).map((item) => (
                <ItemRow key={item.label} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ExpertHelpPlates() {
  const { role } = useSession();

  if (role !== "EXPERT" && role !== "CUSTOMER") return null;

  const plates = getCabinetNav(role);
  const rightAligned = new Set(
    plates
      .filter((p) => !p.href)
      .slice(-2)
      .map((p) => p.key),
  );

  return (
    <div className={s.plates}>
      {plates.map((plate) => (
        <PlateNode
          key={plate.key}
          plate={plate}
          align={rightAligned.has(plate.key) ? "right" : "left"}
        />
      ))}
    </div>
  );
}
