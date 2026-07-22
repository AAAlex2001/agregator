"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/source/features/session";
import { LicenseHolderCard, useLicenseHolders } from "@/source/entities/license-holder";
import Loader from "@/source/shared/ui/Loader";
import ToolTip from "@/source/shared/ui/Tooltip";
import { ChevronIcon, TechExpertLogoIcon } from "@/source/shared/ui/icons";
import {
  getCabinetNav,
  getGuestCabinetNav,
  type NavItem,
  type NavPlate,
} from "../model/navConfig";
import s from "./ExpertHelpPlates.module.scss";

const GUEST_TOOLTIP = "Доступно после регистрации";

function ItemRow({ item }: { item: NavItem }) {
  const inner = (
    <span className={s.itemRow}>
      {item.logoSrc && (
        <Image
          src={item.logoSrc}
          alt={item.logoAlt ?? ""}
          width={90}
          height={55}
          className={s.itemLogo}
        />
      )}
      <span className={s.itemCopy}>
        <span className={s.itemHead}>
          <span className={s.itemLabel}>{item.label}</span>
          {item.soon && <span className={s.soon}>в&nbsp;процессе</span>}
        </span>
        {item.description && <span className={s.itemDesc}>{item.description}</span>}
      </span>
    </span>
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

function RegionsItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.regionsWrap}>
      <button type="button" className={s.regionsToggle} onClick={() => setOpen((value) => !value)}>
        <span className={s.itemLabel}>{item.label}</span>
        <ChevronIcon
          className={`${s.regionsChevron} ${open ? s.regionsChevronOpen : ""}`}
          color="currentColor"
        />
      </button>
      {open && (
        <div className={s.regions}>
          {(item.regions ?? []).map((group) => (
            <div key={group.region} className={s.region}>
              <span className={s.regionName}>{group.region}</span>
              <div className={s.regionLinks}>
                {group.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.regionLink}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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

function PlateNode({
  plate,
  align,
  locked = false,
}: {
  plate: NavPlate;
  align: "left" | "right";
  locked?: boolean;
}) {
  if (locked) {
    return (
      <ToolTip message={GUEST_TOOLTIP} ariaLabel={`${plate.label}. ${GUEST_TOOLTIP}`} side="bottom">
        <span className={`${s.plateWrap} ${s[plate.color]} ${s.plateWrapLocked}`}>
          <button
            type="button"
            className={`${s.plate} ${plate.logo ? s.plateLogo : ""}`}
            aria-disabled="true"
          >
            {plate.logo ? (
              <TechExpertLogoIcon title={plate.label} />
            ) : (
              <>
                <span className={s.plateLabel}>{plate.label}</span>
                {!plate.href && <ChevronIcon className={s.chevron} color="currentColor" />}
              </>
            )}
          </button>
        </span>
      </ToolTip>
    );
  }

  if (plate.href) {
    return (
      <div className={s.plateWrap}>
        <Link href={plate.href} className={`${s.plate} ${s.plateLogo}`} aria-label={plate.label}>
          {plate.logo ? <TechExpertLogoIcon title={plate.label} /> : <span className={s.plateLabel}>{plate.label}</span>}
        </Link>
      </div>
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
              {(plate.items ?? []).map((item) =>
                item.regions ? (
                  <RegionsItem key={item.label} item={item} />
                ) : (
                  <ItemRow key={item.label} item={item} />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ExpertHelpPlates({ mode = "role" }: { mode?: "role" | "guest" }) {
  const { role } = useSession();
  const isGuestMode = mode === "guest";

  if (
    !isGuestMode &&
    role !== "EXPERT" &&
    role !== "CUSTOMER" &&
    role !== "LICENSE_HOLDER"
  ) {
    return null;
  }

  const plates = isGuestMode ? getGuestCabinetNav() : getCabinetNav(role);
  const leftPlates = plates.filter((p) => p.key !== "reviews");
  const reviewsPlate = plates.find((p) => p.key === "reviews");

  return (
    <>
      <div className={s.plates}>
        {leftPlates.map((plate) => (
          <PlateNode key={plate.key} plate={plate} align="left" locked={isGuestMode} />
        ))}
      </div>
      {reviewsPlate && (
        <div className={s.platesRight}>
          <PlateNode plate={reviewsPlate} align="right" locked={isGuestMode} />
        </div>
      )}
    </>
  );
}
