import { useState } from "react";
import { BottomSheet } from "@/shared/ui";
import { ChevronRightIcon, LinkOutIcon } from "@/shared/ui/icons/interface";
import { openLink, tapHaptic } from "@/shared/services/telegram";
import type { UsefulLink, UsefulRegion } from "../model/nav";
import s from "./useful-links.module.scss";

export function UsefulLinks({ links }: { links: UsefulLink[] }) {
  const [regions, setRegions] = useState<{ title: string; items: UsefulRegion[] } | null>(null);

  const open = (link: UsefulLink) => {
    tapHaptic();
    if (link.regions) {
      setRegions({ title: link.label, items: link.regions });
      return;
    }
    if (link.url) openLink(link.url);
  };

  return (
    <>
      <div className={s.group}>
        {links.map((link) =>
          link.soon ? (
            <div key={link.label} className={s.row}>
              <div className={s.text}>
                <span className={s.labelMuted}>{link.label}</span>
                {link.hint && <span className={s.hint}>{link.hint}</span>}
              </div>
              <span className={s.soon}>в процессе</span>
            </div>
          ) : (
            <button key={link.label} type="button" className={s.row} onClick={() => open(link)}>
              <div className={s.text}>
                <span className={s.label}>{link.label}</span>
                {link.hint && <span className={s.hint}>{link.hint}</span>}
              </div>
              {link.regions ? (
                <ChevronRightIcon className={s.rowIcon} width={18} height={18} />
              ) : (
                <LinkOutIcon className={s.rowIcon} width={18} height={18} />
              )}
            </button>
          ),
        )}
      </div>

      <BottomSheet open={regions !== null} title={regions?.title} onClose={() => setRegions(null)}>
        <div className={s.regions}>
          {regions?.items.map((region) => (
            <div key={region.region} className={s.region}>
              <span className={s.regionName}>{region.region}</span>
              <div className={s.regionLinks}>
                {region.links.map((link) => (
                  <button
                    key={link.url}
                    type="button"
                    className={s.regionLink}
                    onClick={() => {
                      tapHaptic();
                      openLink(link.url);
                    }}
                  >
                    {link.label}
                    <LinkOutIcon width={15} height={15} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
