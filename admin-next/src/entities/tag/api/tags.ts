import { adminRequest } from "@/shared/api";
import type { Tag } from "../model/types";

/** Все теги по алфавиту. Общие для статей и разъяснений. */
export const fetchTags = () => adminRequest<Tag[]>("/content/tags");
