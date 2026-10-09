import { notFound } from "next/navigation";

/** id записи из адреса страницы; при мусоре в адресе — страница 404. */
export const parseId = (raw: string): number => {
  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0) notFound();

  return id;
};
