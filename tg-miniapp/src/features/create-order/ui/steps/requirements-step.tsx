import { Button, Checkbox, Field, Select, TextArea, TextField } from "@/shared/ui";
import { OPO_KEYS, TABLE, TYPES } from "@/entites/expertise";
import {
  EXECUTOR_REQUIREMENT_HINTS,
  ORDER_WORK_GROUPS,
  orderDetailsFields,
  orderWorkOptionsOf,
} from "@/entites/order";
import type { ExpertiseType } from "@/entites/expertise";
import { type StepProps } from "./types";
import s from "./requirements-step.module.scss";

const TYPE_OPTIONS = TYPES.map((t) => ({ key: t, label: t }));
const OPO_OPTIONS = OPO_KEYS.map((key) => ({ key, label: `Э${key} — ${TABLE[key].name}` }));

interface Props extends StepProps {
  badgeCodes: string[];
}

export function RequirementsStep({ state, dispatch, badgeCodes }: Props) {
  return (
    <>
      <Field label="Вид работ">
        <Select
          title="Вид работ"
          options={[
            { key: "EXPERTISE", label: "Экспертиза" },
            { key: "OTHER_WORK", label: "Иная инженерная работа" },
          ]}
          value={[state.workType === "EXPERTISE" ? "EXPERTISE" : "OTHER_WORK"]}
          onChange={([value]) => dispatch({
            type: "workType",
            value: value === "EXPERTISE" ? "EXPERTISE" : state.workType === "EXPERTISE" ? "DESIGN_SURVEY" : state.workType,
          })}
        />
      </Field>

      {state.workType !== "EXPERTISE" &&
        ORDER_WORK_GROUPS.map((group) => (
          <Field key={group.key} label={group.title}>
            <div className={s.workOptions}>
              {orderWorkOptionsOf(group.key).map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`${s.workOption} ${state.workType === option.key ? s.workOptionActive : ""}`}
                  onClick={() => {
                    if (state.workType !== option.key) {
                      dispatch({ type: "workType", value: option.key });
                    }
                  }}
                >
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </button>
              ))}
            </div>
          </Field>
        ))}

      {orderDetailsFields(state.workType).map((field) => {
        if (field.kind === "flag") {
          return (
            <Field key={field.key} label={field.label}>
              <Checkbox
                checked={Boolean(state.details[field.key])}
                onChange={(v) => dispatch({ type: "detail", key: field.key, value: v })}
              >
                {field.label}
              </Checkbox>
            </Field>
          );
        }

        if (field.kind === "list") {
          const items = Array.isArray(state.details[field.key])
            ? (state.details[field.key] as string[])
            : [""];
          return (
            <Field key={field.key} label={field.label} hint={EXECUTOR_REQUIREMENT_HINTS.join(", ")}>
              {items.map((item, index) => (
                <div key={index} className={s.requirementRow}>
                  <TextField
                    className={s.requirementInput}
                    value={item}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      dispatch({
                        type: "detail",
                        key: field.key,
                        value: items.map((prev, i) => (i === index ? event.target.value : prev)),
                      })
                    }
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      className={s.requirementRemove}
                      aria-label="Убрать требование"
                      onClick={() =>
                        dispatch({
                          type: "detail",
                          key: field.key,
                          value: items.filter((_, i) => i !== index),
                        })
                      }
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                onClick={() =>
                  dispatch({ type: "detail", key: field.key, value: [...items, ""] })
                }
              >
                + Добавить поле
              </Button>
            </Field>
          );
        }

        const value = String(state.details[field.key] ?? "");
        return (
          <Field key={field.key} label={field.label}>
            {field.kind === "textarea" ? (
              <TextArea
                value={value}
                placeholder={field.placeholder}
                onChange={(event) =>
                  dispatch({ type: "detail", key: field.key, value: event.target.value })
                }
              />
            ) : (
              <TextField
                value={value}
                placeholder={field.placeholder}
                onChange={(event) =>
                  dispatch({ type: "detail", key: field.key, value: event.target.value })
                }
              />
            )}
          </Field>
        );
      })}

      <Field label="Кто требуется для заказа">
        <Checkbox
          checked={state.requiresExpert}
          onChange={(v) => dispatch({ type: "flag", key: "requiresExpert", value: v })}
        >
          Требуется исполнитель
        </Checkbox>
        <Checkbox
          checked={state.requiresLicense}
          onChange={(v) => dispatch({ type: "flag", key: "requiresLicense", value: v })}
        >
          Требуется лицензия
        </Checkbox>
      </Field>

      {state.workType === "EXPERTISE" && <Field label="Объекты экспертизы" hint="Основные объекты экспертизы промышленной безопасности">
        <Select
          multi
          title="Объекты экспертизы"
          options={TYPE_OPTIONS}
          value={state.types}
          placeholder="Выберите объекты"
          onChange={(v) => dispatch({ type: "types", value: v as ExpertiseType[] })}
        />
      </Field>}

      {state.workType === "EXPERTISE" && <Field label="Области аттестации исполнителей" hint="Типовые наименования опасных производственных объектов">
        <Select
          multi
          title="Области аттестации"
          options={OPO_OPTIONS}
          value={state.opos}
          placeholder="Выберите области"
          onChange={(v) => dispatch({ type: "opos", value: v })}
        />
      </Field>}

      {state.workType === "EXPERTISE" && badgeCodes.length > 0 && (
        <Field label="Будут добавлены к заказу">
          <div className={s.codes}>
            {badgeCodes.map((code) => (
              <span key={code} className={s.code}>
                {code}
              </span>
            ))}
          </div>
        </Field>
      )}
    </>
  );
}
