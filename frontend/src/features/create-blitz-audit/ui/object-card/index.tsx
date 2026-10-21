"use client";

import type { Dispatch } from "react";
import type { BlitzAuditCatalog, BlitzAuditObject } from "@/entities/blitz-order";
import { Field } from "@/shared/ui/field";
import { RemoveButton } from "@/shared/ui/remove-button";
import { Select } from "@/shared/ui/select";
import { TextInput } from "@/shared/ui/text-input";
import { OBJECT_FIELDS } from "../../config/options";
import { toOptions } from "../../model/options";
import type { CreateBlitzAuditAction } from "../../model/types";
import styles from "./style.module.scss";

/** ОПО, его номер в списке, справочник и можно ли его убрать. */
interface ObjectCardProps {
  item: BlitzAuditObject;
  index: number;
  catalog: BlitzAuditCatalog;
  isRemovable: boolean;
  dispatch: Dispatch<CreateBlitzAuditAction>;
}

/** Сведения об одном ОПО: номер, наименование, класс, адрес, отрасль и признаки опасности. */
export function ObjectCard({ item, index, catalog, isRemovable, dispatch }: ObjectCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>ОПО {index + 1}</span>
        {isRemovable && (
          <RemoveButton
            label={`Убрать ОПО ${index + 1}`}
            onClick={() => dispatch({ type: "object/remove", index })}
          />
        )}
      </div>
      <div className={styles.grid}>
        {OBJECT_FIELDS.map((entry) => (
          <Field
            key={entry.field}
            label={entry.label}
          >
            <TextInput
              value={item[entry.field]}
              placeholder={entry.placeholder}
              onChange={(event) => dispatch({
                type: "object/change",
                index,
                field: entry.field,
                value: event.target.value,
              })}
            />
          </Field>
        ))}
        <Field label="Класс опасности">
          <Select
            ariaLabel="Класс опасности"
            placeholder="Выберите класс"
            options={catalog.hazard_classes.map((value) => ({ value, label: `${value} класс` }))}
            value={item.hazard_class}
            onChange={(value) => dispatch({
              type: "object/change",
              index,
              field: "hazard_class",
              value,
            })}
          />
        </Field>
        <Field label="Признаки опасности">
          <Select
            multiple
            ariaLabel="Признаки опасности"
            placeholder="Выберите признаки"
            options={toOptions(catalog.hazard_signs)}
            value={item.hazard_signs}
            onChange={(signs) => dispatch({ type: "object/signs", index, signs })}
          />
        </Field>
      </div>
    </div>
  );
}