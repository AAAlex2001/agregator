export interface FaqEntry {
  question: string;
  answer: string;
}

const MIN_QUESTIONS = 3;
const MIN_ANSWER_LENGTH = 80;
const MAX_ANSWER_LENGTH = 900;

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&laquo;": "«",
  "&raquo;": "»",
  "&mdash;": "—",
  "&ndash;": "–",
};

function toText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, (entity) => ENTITIES[entity] ?? entity)
    .replace(/\s+/g, " ")
    .trim();
}

/** Разделы с заголовком-вопросом и ответом достаточной длины — для разметки FAQPage. */
export function extractFaq(html: string): FaqEntry[] {
  const sections = html.split(/<h2(?:\s[^>]*)?>/i).slice(1);
  const entries: FaqEntry[] = [];

  for (const section of sections) {
    const headingEnd = section.indexOf("</h2>");
    if (headingEnd === -1) continue;
    const question = toText(section.slice(0, headingEnd));
    if (!question.endsWith("?")) continue;
    const answer = toText(section.slice(headingEnd + 5)).slice(0, MAX_ANSWER_LENGTH);
    if (answer.length >= MIN_ANSWER_LENGTH) entries.push({ question, answer });
  }

  return entries.length >= MIN_QUESTIONS ? entries : [];
}
