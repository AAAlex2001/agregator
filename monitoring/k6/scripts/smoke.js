import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 30 },
    { duration: "3m", target: 30 },
    { duration: "1m", target: 0 }
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<800"]
  }
};

const BASE_URL = __ENV.BASE_URL || "http://176.57.215.114";

export default function () {
  const health = http.get(`${BASE_URL}/health`);
  check(health, {
    "health: status 200": (r) => r.status === 200
  });

  const root = http.get(`${BASE_URL}/`);
  check(root, {
    "root: status 200": (r) => r.status === 200
  });

  sleep(1);
}
