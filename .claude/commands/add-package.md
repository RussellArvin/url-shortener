Create a new workspace package named "$ARGUMENTS".

Follow the exact conventions documented in CLAUDE.md:

1. Create `packages/$ARGUMENTS/package.json`:
   - name: `@url-shortener/$ARGUMENTS`
   - version: "0.0.0", private: true, type: "module"
   - exports: { ".": "./src/index.ts", "./_": "./src/_.ts" }
2. Create `packages/$ARGUMENTS/tsconfig.json` extending `../../tsconfig.base.json` with include: ["src/**/*.ts"]
3. Create `packages/$ARGUMENTS/src/index.ts` with a placeholder export
4. Run `bun install` to link the new workspace

After creation, tell me how to depend on this package from other packages (add `"@url-shortener/$ARGUMENTS": "workspace:*"` to their package.json and run `bun install`).
