// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";
import denoJson from "./deno.json" with { type: "json" };

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: "dev",
  },
  testPattern: "tests/[!_]*_test.ts",
  importMap: "deno.json",
  typeCheck: false,
  package: {
    name: denoJson.name,
    version: denoJson.version,
    description: denoJson.description,
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/ankarhem/secrecy-ts.git",
    },
    bugs: {
      url: "https://github.com/ankarhem/secrecy-ts/issues",
    },
  },
});
