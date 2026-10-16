"use client";

import { useState } from "react";
import { addCertificate } from "./certificates";
import type { CertificateFields, ExpertCertificate } from "./types";

/** Начальные значения полей нового удостоверения. */
const EMPTY_FIELDS: CertificateFields = {
  area: "",
  object: "",
  category: "",
  expiresAt: "",
};

/** Управляет полями нового удостоверения и списком добавленных удостоверений. */
export function useCertificateBuilder(
  certificates: ExpertCertificate[],
  onChange: (certificates: ExpertCertificate[]) => void,
) {
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const canAdd = Boolean(
    fields.area
    && fields.object
    && fields.category
    && fields.expiresAt,
  );

  /** Добавляет заполненное удостоверение без дублей и очищает поля после добавления. */
  function add() {
    const nextCertificates = addCertificate(certificates, fields);

    if (nextCertificates === certificates) {
      return;
    }

    onChange(nextCertificates);
    setFields(EMPTY_FIELDS);
  }

  /** Удаляет выбранное удостоверение из списка анкеты. */
  function remove(index: number) {
    const remainingCertificates = certificates.filter(
      (certificate, certificateIndex) => certificateIndex !== index,
    );

    onChange(remainingCertificates);
  }

  /** Меняет область аттестации нового удостоверения. */
  function changeArea(area: string) {
    setFields((currentFields) => ({
      ...currentFields,
      area,
    }));
  }

  /** Меняет объект экспертизы нового удостоверения. */
  function changeObject(object: string) {
    setFields((currentFields) => ({
      ...currentFields,
      object,
    }));
  }

  /** Меняет категорию нового удостоверения. */
  function changeCategory(category: string) {
    setFields((currentFields) => ({
      ...currentFields,
      category,
    }));
  }

  /** Меняет срок действия нового удостоверения. */
  function changeExpiry(expiresAt: string) {
    setFields((currentFields) => ({
      ...currentFields,
      expiresAt,
    }));
  }

  return {
    fields,
    canAdd,
    add,
    remove,
    changeArea,
    changeObject,
    changeCategory,
    changeExpiry,
  };
}
