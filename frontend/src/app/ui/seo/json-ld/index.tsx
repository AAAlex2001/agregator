/** Сериализованные структурированные данные страницы. */
interface JsonLdProps {
  json: string;
}

/** Добавляет JSON-LD в HTML, экранируя символ начала HTML-тега внутри данных. */
export function JsonLd({ json }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: json.replace(/</g, "\\u003c"),
      }}
    />
  );
}
