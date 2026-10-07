import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// JSX/TSX in tests is transformed by Vite's built-in transform — the
// @vitejs/plugin-react babel pipeline is deliberately not used (it caused
// an npm ERESOLVE conflict on Vercel between @babel/core 7 and 8 in the
// shadcn toolchain).
export default defineConfig({
  resolve: {
    alias: {
      "next/image": fileURLToPath(
        new URL("./tests/stubs/next-image.tsx", import.meta.url)
      ),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "tests/e2e/**"],
  },
});
