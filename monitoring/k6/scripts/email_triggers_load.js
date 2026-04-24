// Нагрузочный сценарий для email-триггерящих эндпоинтов.
// Бьём в register, forgot-password send-code и list orders.
// Цель: убедиться, что BackgroundTasks не забивают event loop и запросы
// отвечают быстрее 500ms под 20-30 RPS.
//
// Запуск (из контейнера k6):
//   docker compose exec k6 k6 run /scripts/email_triggers_load.js
//
// Можно править VUS / duration через флаги.

import http from "k6/http";
import { check, sleep } from "k6";

// В k6 4xx по умолчанию падает в http_req_failed. Говорим "ожидаем 2xx и 4xx",
// чтобы threshold не краснел на валидных бизнес-ответах вроде 400 (дубликат) и 404 (юзер не найден).
http.setResponseCallback(http.expectedStatuses({ min: 200, max: 499 }));

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m",  target: 20 },
    { duration: "30s", target: 30 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<500"],
    "http_req_duration{name:register}": ["p(95)<800"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://176.57.215.114";
const DEBUG = __ENV.DEBUG === "1";

function randomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function logBadStatus(label, response, allowed) {
  if (!DEBUG) return;
  if (allowed.includes(response.status)) return;
  console.warn(`[${label}] unexpected status=${response.status} body=${response.body}`);
}

function scenarioRegister() {
  const email = `k6-${randomString(12)}@example.com`;
  const payload = JSON.stringify({
    role: "CUSTOMER",
    email,
    password: "LoadTest123$abc",
    first_name: "Load",
    last_name: "Test",
  });
  const response = http.post(`${BASE_URL}/api/register/`, payload, {
    headers: { "Content-Type": "application/json" },
    tags: { name: "register" },
  });
  logBadStatus("register", response, [201, 400, 409, 422]);
  check(response, {
    "register: 2xx или бизнес-4xx": (r) => [201, 400, 409, 422].includes(r.status),
    "register: быстро": (r) => r.timings.duration < 1500,
  });
}

function scenarioForgotPassword() {
  const payload = JSON.stringify({ email: `unknown-${randomString(8)}@example.com` });
  const response = http.post(`${BASE_URL}/api/forgot-password/send-code`, payload, {
    headers: { "Content-Type": "application/json" },
    tags: { name: "forgot_password" },
  });
  logBadStatus("forgot", response, [200, 400, 404, 422]);
  check(response, {
    "forgot: 2xx или бизнес-4xx": (r) => [200, 400, 404, 422].includes(r.status),
    "forgot: быстро": (r) => r.timings.duration < 600,
  });
}

function scenarioListOrders() {
  const response = http.get(`${BASE_URL}/api/orders/`, { tags: { name: "list_orders" } });
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
