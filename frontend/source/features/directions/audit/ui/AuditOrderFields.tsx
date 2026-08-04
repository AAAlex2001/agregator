"use client";

import Button from "@/source/shared/ui/Button";
import Tabs from "@/source/shared/ui/Tabs";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { ApplicantFields } from "../../shared/ui/ApplicantFields";
import type {
  AuditCatalogs,
  AuditKind,
  AuditOrderDetails,
  AuditScale,
  AuditTimeline,
} from "../model/types";
import { emptyAuditOpoItem } from "../model/types";
import { AuditOrderFileField } from "./AuditOrderFileField";
import { OpoItemFields } from "./OpoItemFields";
import s from "../../shared/ui/fields.module.scss";
import own from "./AuditOrderFields.module.scss";

const SCALE_TABS = [
  { id: "SINGLE_OPO", label: "Один ОПО" },
  { id: "ALL_OPO", label: "Все ОПО организации" },
  { id: "SELECTED_OPO", label: "Выборочные ОПО" },
];

const KIND_TABS = [
  { id: "BASIC", label: "Базовый" },
  { id: "INTERIM", label: "Промежуточный" },
  { id: "SELECTIVE", label: "Выборочный" },
  { id: "CONSULTATION", label: "Консультация" },
];

const TIMELINE_TABS = [
  { id: "MONTH_URGENT", label: "В течение месяца (срочно)" },
  { id: "CURRENT_QUARTER", label: "Текущий квартал" },
  { id: "NEXT_QUARTER", label: "Следующий квартал" },
  { id: "CONSULTATION", label: "Консультация" },
];

const OPO_CLASS_FIELDS = [
  { key: "opo_class_1", label: "I класс" },
  { key: "opo_class_2", label: "II класс" },
  { key: "opo_class_3", label: "III класс" },
  { key: "opo_class_4", label: "IV класс" },
] as const;

function parseCount(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  return digits ? Number(digits) : null;
}

interface Props {
  value: AuditOrderDetails;
  onChange: (value: AuditOrderDetails) => void;
  catalogs: AuditCatalogs;
}

export function AuditOrderFields({ value, onChange, catalogs }: Props) {
  const changeScale = (scale: AuditScale) => {
    if (scale === "SINGLE_OPO") {
      onChange({ ...value, audit_scale: scale, opo_items: [value.opo_items[0] ?? { ...emptyAuditOpoItem }] });
      return;
    }
    if (scale === "ALL_OPO") {
      onChange({ ...value, audit_scale: scale, opo_items: [] });
      return;
    }
    onChange({
      ...value,
      audit_scale: scale,
      opo_items: value.opo_items.length ? value.opo_items : [{ ...emptyAuditOpoItem }],
    });
  };

  const changeOpoItem = (index: number, item: (typeof value.opo_items)[number]) => {
    onChange({
      ...value,
      opo_items: value.opo_items.map((prev, position) => (position === index ? item : prev)),
    });
  };

  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Сведения о заявителе</span>
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </div>

      <div className={s.field}>
        <span className={s.label}>Что нужно аудировать</span>
        <Tabs
          tabs={SCALE_TABS}
          activeTab={value.audit_scale}
          onTabChange={(id) => changeScale(id as AuditScale)}
          variant="squared"
        />
      </div>

      {value.audit_scale === "SINGLE_OPO" && value.opo_items[0] && (
        <div className={s.field}>
          <span className={s.label}>Сведения об объекте</span>
          <OpoItemFields value={value.opo_items[0]} onChange={(item) => changeOpoItem(0, item)} />
        </div>
      )}

      {value.audit_scale === "ALL_OPO" && (
        <>
          <label className={s.field}>
            <span className={s.label}>Общее количество ОПО</span>
            <TextInput
              value={value.opo_total === null ? "" : String(value.opo_total)}
              onChange={(event) => onChange({ ...value, opo_total: parseCount(event.target.value) })}
              placeholder="0"
              inputMode="numeric"
            />
          </label>

          <div className={s.field}>
            <span className={s.label}>Количество ОПО по классам опасности</span>
            <div className={own.classGrid}>
              {OPO_CLASS_FIELDS.map((field) => (
                <label key={field.key} className={s.cell}>
                  <span className={s.cellLabel}>{field.label}</span>
                  <TextInput
                    value={value[field.key] === null ? "" : String(value[field.key])}
                    onChange={(event) =>
                      onChange({ ...value, [field.key]: parseCount(event.target.value) })
                    }
                    placeholder="0"
                    inputMode="numeric"
                  />
                </label>
              ))}
            </div>
          </div>

          <label className={s.field}>
            <span className={s.label}>Основной отраслевой профиль</span>
            <TextInput
              value={value.main_industry}
              onChange={(event) => onChange({ ...value, main_industry: event.target.value })}
              placeholder="Металлургия, газоснабжение, химия"
            />
          </label>

          <div className={s.field}>
            <span className={s.label}>ОПО расположены в разных субъектах РФ</span>
            <YesNoField
              value={value.multiple_regions}
              onChange={(next) => onChange({ ...value, multiple_regions: next })}
            />
          </div>

          <AuditOrderFileField
            label="Свидетельство о регистрации ОПО"
            value={value.registration_certificate}
            onChange={(next) => onChange({ ...value, registration_certificate: next })}
          />
        </>
      )}

      {value.audit_scale === "SELECTED_OPO" && (
        <div className={s.field}>
          <span className={s.label}>Объекты для аудита</span>
          {value.opo_items.map((item, index) => (
            <div key={index} className={own.opoCard}>
              <div className={own.opoCardHead}>
                <span className={own.opoCardTitle}>ОПО №{index + 1}</span>
                {value.opo_items.length > 1 && (
                  <button
                    type="button"
                    className={own.removeOpo}
                    aria-label="Убрать объект"
                    onClick={() =>
                      onChange({
                        ...value,
                        opo_items: value.opo_items.filter((prev, position) => position !== index),
                      })
                    }
                  >
                    ×
                  </button>
                )}
              </div>
              <OpoItemFields value={item} onChange={(next) => changeOpoItem(index, next)} />
            </div>
          ))}
          <Button
            type="button"
            variant="transparent"
            size="sm"
            className={own.addOpo}
            onClick={() =>
              onChange({ ...value, opo_items: [...value.opo_items, { ...emptyAuditOpoItem }] })
            }
          >
            + Добавить объект
          </Button>
        </div>
      )}

      <div className={s.field}>
        <span className={s.label}>Тип аудита</span>
        <Tabs
          tabs={KIND_TABS}
          activeTab={value.audit_kind}
          onTabChange={(id) => onChange({ ...value, audit_kind: id as AuditKind })}
          variant="squared"
        />
      </div>

      {(value.audit_kind === "BASIC" || value.audit_kind === "INTERIM") && (
        <div className={s.field}>
          <span className={s.label}>
            Учитывать внутренние стандарты организации (СТО) в области промышленной безопасности
          </span>
          <YesNoField
            value={value.considers_sto}
            onChange={(next) => onChange({ ...value, considers_sto: next })}
          />
          {value.considers_sto && (
            <>
              <TextInput
                value={value.sto_name}
                onChange={(event) => onChange({ ...value, sto_name: event.target.value })}
                placeholder="Наименование и реквизиты СТО"
              />
              <AuditOrderFileField
                label="Файл СТО"
                value={value.sto_file}
                onChange={(next) => onChange({ ...value, sto_file: next })}
              />
            </>
          )}
        </div>
      )}

      {value.audit_kind === "SELECTIVE" && (
        <div className={s.field}>
          <span className={s.label}>Направления аудита по пункту 17 Приказа № 318</span>
          <MultiSelect
            id="audit-areas-p17"
            options={catalogs.audit_areas}
            value={value.audit_areas}
            onChange={(next) => onChange({ ...value, audit_areas: next })}
          />
        </div>
      )}

      <div className={s.field}>
        <span className={s.label}>Желаемые сроки проведения</span>
        <Tabs
          tabs={TIMELINE_TABS}
          activeTab={value.desired_timeline}
          onTabChange={(id) => onChange({ ...value, desired_timeline: id as AuditTimeline })}
          variant="squared"
        />
      </div>

      <label className={s.field}>
        <span className={s.label}>Комментарии, пояснения, вопросы</span>
        <TextArea
          value={value.comments}
          onChange={(event) => onChange({ ...value, comments: event.target.value })}
          placeholder="Дополнительная информация для аудитора"
          maxLength={5000}
        />
      </label>

      <span className={s.hint}>
        Техническое задание и дополнительные файлы приложите в файлах заявки ниже.
      </span>
    </div>
  );
}
