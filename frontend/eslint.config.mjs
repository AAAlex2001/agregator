import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["useMemo", "useCallback"],
              message: "Используем обычные функции и вычисления.",
            },
          ],
        },
      ],
      "react/jsx-max-props-per-line": [
        "error",
        {
          maximum: 1,
          when: "always",
        },
      ],
      "react/jsx-first-prop-new-line": [
        "error",
        "multiline-multiprop",
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
