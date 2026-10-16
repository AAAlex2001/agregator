"use client";

import { Field } from "@/shared/ui/field";
import { YesNoField } from "@/shared/ui/yes-no-field";
import { SRO_LABELS } from "../../config/options";
import type { SroDirection } from "../../model/types";

/** Разрешения члена СРО на работы с особыми категориями объектов. */
interface ObjectRightsFieldsProps {
  direction: SroDirection;
  hazardousObjectsRight: boolean;
  nuclearObjectsRight: boolean;
  onHazardousObjectsChange: (allowed: boolean) => void;
  onNuclearObjectsChange: (allowed: boolean) => void;
}

/** Права организации на работы с опасными и атомными объектами. */
export function ObjectRightsFields({
  direction,
  hazardousObjectsRight,
  nuclearObjectsRight,
  onHazardousObjectsChange,
  onNuclearObjectsChange,
}: ObjectRightsFieldsProps) {
  const labels = SRO_LABELS[direction];

  return (
    <>
      <Field label={labels.hazardous}>
        <YesNoField
          value={hazardousObjectsRight}
          onChange={onHazardousObjectsChange}
        />
      </Field>

      <Field label={labels.nuclear}>
        <YesNoField
          value={nuclearObjectsRight}
          onChange={onNuclearObjectsChange}
        />
      </Field>
    </>
  );
}
