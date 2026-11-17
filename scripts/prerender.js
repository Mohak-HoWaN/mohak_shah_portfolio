// Writes the rendered page into dist/index.html so crawlers and link previews get the copy without running JS.
// The page reads window while rendering, so it gets the defaults of a desktop visitor on the vision lens,
// which is the case main.tsx then hydrates without re-rendering.
import { readFileSync, writeFileSync } from "node:fs";

globalThis.window = {
  location: { search: "" },
  matchMedia: (query) => ({ matches: query.includes("hover: hover"), addEventListener() {}, removeEventListener() {} }),
};
const { render } = await import("../dist-ssr/entry-server.js");

const file = "dist/index.html";
const html = readFileSync(file, "utf8");
const root = '<div id="root"></div>';
if (!html.includes(root)) throw new Error(`${file} has no empty ${root}`);
writeFileSync(file, html.replace(root, `<div id="root">${render()}</div>`));
