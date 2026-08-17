"use client";

import { useEffect, useState } from "react";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { fetchEcologyCatalogs } from "../model/api";
import { emptyEcologyCatalogs, type EcologyCatalogs, type EcologyOrderDetails } from "../model/types";
import { ApplicantFields } from "../../shared/ui/ApplicantFields";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: EcologyOrderDetails;
  onChange: (value: EcologyOrderDetails) => void;
}

export function EcologyOrderFields({ value, onChange }: Props) {
  const [catalogs, setCatalogs] = useState<EcologyCatalogs>(emptyEcologyCatalogs);

  useEffect(() => {
    let alive = true;
    fetchEcologyCatalogs()
      .then((loaded) => alive && setCatalogs(loaded))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Сведения о заявителе</span>
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </div>

      <div className={s.field}>
        <span className={s.label}>Какие работы нужны</span>
        <MultiSelect
          id="ecology-order-work-types"
          options={catalogs.work_types}
          value={value.work_types}
          onChange={(next) => onChange({ ...value, work_types: next })}
        />
      </div>
    </div>
  );
}
