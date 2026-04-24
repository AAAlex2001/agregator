// Нагрузочный сценарий для email-триггерящих эндпоинтов.
// Бьём одновременно в register, forgot-password send-code и list orders.
// Цель: убедиться, что BackgroundTasks не забивают event loop и запросы
// отвечают быстрее 500ms под 20-30 RPS.
//
// Запуск (из контейнера k6):
//   k6 run --vus 20 --duration 1m /scripts/email_triggers_load.js
//
// Можно править VUS / duration через флаги.

import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 },   // разгон
    { duration: "1m",  target: 20 },   // плато
    { duration: "30s", target: 30 },   // пиковая нагрузка
    { duration: "20s", target: 0 },    // остывание
  ],
  thresholds: {
    // ≤ 5% ошибок на HTTP уровне
    http_req_failed: ["rate<0.05"],
    // 95% ответов быстрее 500ms (BackgroundTasks не должны замедлять ответ)
    http_req_duration: ["p(95)<500"],
    // register эндпоинт — особенно важный (bcrypt + schedule_email)
    "http_req_duration{name:register}": ["p(95)<800"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://176.57.215.114";

function randomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function scenarioRegister() {
  const email = `k6-${randomString(12)}@example.test`;
  const payload = JSON.stringify({
    role: "CUSTOMER",
    email,
    password: "Test123$",
    first_name: "Load",
    last_name: "Test",
  });
  const response = http.post(`${BASE_URL}/api/register/`, payload, {
    headers: { "Content-Type": "application/json" },
    tags: { name: "register" },
  });
  check(response, {
    "register: 201 или 400 (дубликат ок)": (r) => r.status === 201 || r.status === 400,
    "register: быстро": (r) => r.timings.duration < 1500,
  });
}

function scenarioForgotPassword() {
  const payload = JSON.stringify({ email: `unknown-${randomString(8)}@example.test` });
  const response = http.post(`${BASE_URL}/api/forgot-password/send-code`, payload, {
    headers: { "Content-Type": "application/json" },
    tags: { name: "forgot_password" },
  });
  // Ожидаем 200 или 404 — оба валидны (ответ не должен тянуть за собой SMTP)
  check(response, {
    "forgot: 200 или 404": (r) => r.status === 200 || r.status === 404,
    "forgot: быстро": (r) => r.timings.duration < 600,
  });
}

function scenarioListOrders() {
  const response = http.get(`${BASE_URL}/api/orders/`, {
    tags: { name: "list_orders" },
  });
  check(response, {
    "list_orders: 200/401": (r) => r.status === 200 || r.status === 401,
  });
}

export default function () {
  const pick = Math.random();
  if (pick < 0.4) {
    scenarioRegister();
  } else if (pick < 0.7) {
    scenarioForgotPassword();
  } else {
    scenarioListOrders();
  }
  sleep(Math.random() * 1.0);
}
