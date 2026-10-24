import { cp, mkdir, rm } from "node:fs/promises";

const files = [
  "index.html",
  "privacy.html",
  "terms.html",
  "refunds.html",
  "support.html",
  "source.html",
  "account-deletion.html",
  "styles.css",
  "script.js",
  "favicon.svg",
  "robots.txt",
  "sitemap.xml"
];
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await Promise.all(files.map((file) => cp(file, `dist/${file}`)));
console.log(`Built ${files.length} files into dist/`);
