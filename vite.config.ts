import { defineConfig } from "vite";
const path = require("path");
import typescript from "@rollup/plugin-typescript";

const resolvePath = (str: string) => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "natural-order",
      fileName: (format) => `natural-order.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
      plugins: [
        typescript({
          target: "es2020",
          rootDir: resolvePath("./src"),
          declaration: true,
          declarationDir: resolvePath("./dist"),
          exclude: resolvePath("./node_modules/**"),
          allowSyntheticDefaultImports: true,
        }),
      ],
    },
  },
});
