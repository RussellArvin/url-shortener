import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

// eslint-disable-next-line @typescript-eslint/no-deprecated
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  eslintPluginPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["packages/server/**/*.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='execute']",
          message:
            "db.execute() is banned. Use Drizzle query builder (db.select(), db.insert(), etc.). Add an eslint-disable comment with justification if necessary.",
        },
      ],
    },
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "packages/*/dist/",
      // shadcn / vendored UI primitives — not our code
      "packages/app/src/components/ui/",
      // playwright e2e — runs in its own runtime, has its own test runner
      "packages/e2e/",
    ],
  },
);
