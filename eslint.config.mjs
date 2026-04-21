import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", ".open-next/**", "out/**", "coverage/**", "node_modules/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Console use is centralized in src/lib/logger.ts.
      "no-console": "off",
      // Allow 'any' types for now (will fix incrementally)
      "@typescript-eslint/no-explicit-any": "warn",
      // User-facing educational copy contains normal apostrophes and quotes.
      "react/no-unescaped-entities": "off",
      // Allow unused vars (many are for future use)
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      // React hooks exhaustive deps - warn only
      "react-hooks/exhaustive-deps": "warn",
      // Prefer const - warn only
      "prefer-const": "warn",
      // Empty object types - warn only
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },
];

export default eslintConfig;
