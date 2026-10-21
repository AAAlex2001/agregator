import type { BlitzChoice } from "@/entities/blitz-order";

/** Варианты справочника для выпадающего списка. */
export function toOptions(choices: BlitzChoice[]) {
  return choices.map((choice) => ({ value: choice.code, label: choice.title }));
}

/** Значение из списка допустимых, если выбранная строка — одно из них. */
export function pickOne<Value extends string>(values: Value[], value: string): Value | undefined {
  return values.find((item) => item === value);
}

/** Только допустимые значения из выбранных строк. */
export function pickMany<Value extends string>(values: Value[], chosen: string[]): Value[] {
  return values.filter((item) => chosen.includes(item));
}