import { adminRequest } from "@/shared/api";
import type { Taxonomy } from "../model/types";

/** Справочники классификатора «Ростехнадзор отвечает». */
export const fetchTaxonomy = () => adminRequest<Taxonomy>("/rtn/taxonomy");
