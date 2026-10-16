import assert from "node:assert/strict";
import test from "node:test";
import { createOrderMetadata } from "./order.ts";

/** Публичный заказ с разными внешним и внутренним идентификаторами. */
const order = {
  id: 42,
  public_id: "public-order-id",
  title: "  Проверка\n оборудования  ",
  company: " Компания  заказчика ",
  comment: " Осмотр\nоборудования. ",
  sum: " 100  000 ₽ ",
  date: " 20.10.2026 ",
  badges: [
    { text: " Опыт  работы ", variant: "default" },
    { text: " Аттестация ", variant: "default" },
  ],
};

test("order metadata uses the public URL and retains the complete description", () => {
  const metadata = createOrderMetadata(order.public_id, order);
  const description = "Осмотр оборудования. Заказчик: Компания заказчика. "
    + "Начальная цена: 100 000 ₽. Срок выполнения: до 20.10.2026. "
    + "Требования: Опыт работы, Аттестация.";

  assert.deepEqual(metadata, {
    title: "Проверка оборудования",
    description,
    alternates: { canonical: "/order/public-order-id" },
    openGraph: {
      type: "website",
      title: "Проверка оборудования",
      description,
      url: "/order/public-order-id",
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: "Ресурс-Плюс",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: "Проверка оборудования",
      description,
      images: ["/og-default.png"],
    },
  });
});

test("long descriptions retain the existing 220 character limit", () => {
  const metadata = createOrderMetadata(order.public_id, {
    ...order,
    comment: "А".repeat(240),
  });

  assert.equal(metadata.description, `${"А".repeat(219)}…`);
  assert.equal(metadata.description.length, 220);
});

test("empty order fields retain the original fallback title and description", () => {
  const metadata = createOrderMetadata(order.public_id, {
    ...order,
    title: "  ",
    company: null,
    comment: "",
    sum: "",
    date: "",
    badges: [],
  });

  assert.equal(metadata.title, "Заявка № 42");
  assert.equal(
    metadata.description,
    "Открытая заявка «» на платформе Ресурс-Плюс.",
  );
});

test("unavailable orders retain noindex and the default preview image", () => {
  assert.deepEqual(createOrderMetadata(order.public_id, null), {
    title: "Заявка не найдена",
    robots: { index: false, follow: false },
    openGraph: { images: ["/og-default.png"] },
    twitter: { images: ["/og-default.png"] },
  });
});
