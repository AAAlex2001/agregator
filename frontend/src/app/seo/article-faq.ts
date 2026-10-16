/** Вопрос и ответ из текста статьи для разметки FAQPage. */
export interface ArticleFaqEntry {
  question: string;
  answer: string;
}

/** FAQ публикуется только для трёх и более содержательных ответов. */
const MIN_QUESTIONS = 3;

/** Ответ короче этой длины не считается содержательным. */
const MIN_ANSWER_LENGTH = 80;

/** Наибольшая длина ответа в разметке FAQ. */
const MAX_ANSWER_LENGTH = 900;

/** HTML-символы, встречающиеся в заголовках и тексте статей. */
const HTML_ENTITIES = new Map([
  ["&nbsp;", " "],
  ["&amp;", "&"],
  ["&quot;", '"'],
  ["&laquo;", "«"],
  ["&raquo;", "»"],
  ["&mdash;", "—"],
  ["&ndash;", "–"],
]);

/** Убирает разметку и лишние пробелы из вопроса или ответа. */
function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, (entity) => HTML_ENTITIES.get(entity) ?? entity)
    .replace(/\s+/g, " ")
    .trim();
}

/** Выбирает разделы с вопросом в h2 и ответом достаточной длины. */
export function extractArticleFaq(html: string): ArticleFaqEntry[] {
  const entries = html
    .split(/<h2(?:\s[^>]*)?>/i)
    .slice(1)
    .filter((section) => section.includes("</h2>"))
    .map((section) => {
      const headingEnd = section.indexOf("</h2>");

      return {
        question: toPlainText(section.slice(0, headingEnd)),
        answer: toPlainText(section.slice(headingEnd + 5)).slice(0, MAX_ANSWER_LENGTH),
      };
    })
    .filter((entry) => (
      entry.question.endsWith("?") && entry.answer.length >= MIN_ANSWER_LENGTH
    ));

  return entries.length >= MIN_QUESTIONS ? entries : [];
}
