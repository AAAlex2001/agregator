"use client";

import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { GeoSuggestInput } from "@/shared/ui/geo-suggest-input";
import { Tabs } from "@/shared/ui/tabs";
import { TextInput } from "@/shared/ui/text-input";
import type { ForensicWorkplaceKind } from "../../model/types";

/** Варианты работы эксперта; id совпадают со значениями ForensicWorkplaceKind в API. */
const WORKPLACE_TABS = [
  {
    id: "INDIVIDUAL",
    label: "Действую как физлицо",
  },
  {
    id: "ORGANIZATION",
    label: "Экспертная организация",
  },
];

/** Город, форма работы эксперта и название его организации. */
interface WorkplaceFieldsProps {
  city: string;
  kind: ForensicWorkplaceKind;
  name: string;
  onCityChange: (value: string) => void;
  onKindChange: (value: ForensicWorkplaceKind) => void;
  onNameChange: (value: string) => void;
}

/** Город эксперта и работа самостоятельно либо от экспертной организации. */
export function WorkplaceFields({
  city,
  kind,
  name,
  onCityChange,
  onKindChange,
  onNameChange,
}: WorkplaceFieldsProps) {
  /** Принимает только два способа работы, поддерживаемых API. */
  function changeKind(nextKind: string) {
    if (nextKind === "INDIVIDUAL" || nextKind === "ORGANIZATION") {
      onKindChange(nextKind);
    }
  }

  /** Передаёт название экспертной организации в анкету. */
  function changeName(event: ChangeEvent<HTMLInputElement>) {
    onNameChange(event.target.value);
  }

  return (
    <>
      <Field label="Местонахождение">
        <GeoSuggestInput
          value={city}
          onChange={onCityChange}
          placeholder="Город"
        />
      </Field>

      <Field label="Место работы">
        <Tabs
          tabs={WORKPLACE_TABS}
          activeTab={kind}
          onTabChange={changeKind}
        />
        {kind === "ORGANIZATION" && (
          <TextInput
            value={name}
            onChange={changeName}
            placeholder="Наименование экспертной организации"
          />
        )}
      </Field>
    </>
  );
}
