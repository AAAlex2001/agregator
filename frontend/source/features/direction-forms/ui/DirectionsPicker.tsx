"use client";

import { Checkbox } from "@/source/shared/ui";
import type { DirectionCatalogs, DirectionKey, DirectionProfile } from "@/source/entities/direction";
import type { UserRole } from "@/source/entities/user";
import { directionOptionsForRole, getDirectionForm } from "../model/registry";
import { DirectionDocumentsPicker } from "./DirectionDocumentsPicker";
import s from "./DirectionsPicker.module.scss";

interface Props {
  role: UserRole;
  selected: Partial<Record<DirectionKey, DirectionProfile>>;
  catalogs: DirectionCatalogs;
  documents: Partial<Record<DirectionKey, File[]>>;
  errors?: Partial<Record<DirectionKey, string>>;
  onToggle: (key: DirectionKey) => void;
  onChange: (key: DirectionKey, value: DirectionProfile) => void;
  onDocumentsAdd: (key: DirectionKey, files: File[]) => void;
  onDocumentsRemove: (key: DirectionKey, index: number) => void;
}

export function DirectionsPicker({
  role,
  selected,
  catalogs,
  documents,
  errors,
  onToggle,
  onChange,
  onDocumentsAdd,
  onDocumentsRemove,
}: Props) {
  const options = directionOptionsForRole(role);
  if (!options.length) return null;

  return (
    <div className={s.root}>
      <ul className={s.list}>
        {options.map((option) => {
          const value = selected[option.key];
          const form = getDirectionForm(option.key, role);
          const error = errors?.[option.key];

          return (
            <li
              key={option.key}
              className={value ? `${s.item} ${s.itemActive}` : s.item}
              data-invalid={error ? "true" : undefined}
            >
              <Checkbox
                id={`direction-${option.key}`}
                checked={Boolean(value)}
                onChange={() => onToggle(option.key)}
                className={s.checkbox}
              >
                <span className={s.itemTitle}>{option.title}</span>
                <span className={s.itemText}>{option.description}</span>
              </Checkbox>

              {value && form && (
                <div className={s.body}>
                  <form.Form
                    value={value}
                    onChange={(next) => onChange(option.key, next)}
                    catalogs={catalogs}
                  />
                  {form.supportsDocuments && (
                    <DirectionDocumentsPicker
                      files={documents[option.key] ?? []}
                      onAdd={(files) => onDocumentsAdd(option.key, files)}
                      onRemove={(index) => onDocumentsRemove(option.key, index)}
                    />
                  )}
                  {error && <span className={s.error}>{error}</span>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
