import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
const robots = await readFile(new URL("../robots.txt", import.meta.url), "utf8");
const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");

test("publishes the Sovereign Mail identity without unsupported launch claims", () => {
  assert.match(html, /Sovereign Mail/);
  assert.match(html, /under active development/i);
  assert.doesNotMatch(html, /trusted by|customers|production-ready/i);
});

test("describes both multi-domain infrastructure and governed agents", () => {
  assert.match(html, /Every domain, visible at once/);
  assert.match(html, /Agent harness/i);
  assert.match(html, /Send requires approval/i);
});

test("uses sovereignmail.com as the canonical public domain", () => {
  for (const source of [html, robots, sitemap]) {
    assert.match(source, /sovereignmail\.com/);
    assert.doesNotMatch(source, /mailsovereign\.com/);
  }
});

test("uses only secure external links", () => {
  const externalLinks = [...html.matchAll(/href="(https?:[^\"]+)"/g)].map((match) => match[1]);
  assert.ok(externalLinks.length > 0);
  assert.ok(externalLinks.every((url) => url.startsWith("https://")));
});

test("Vercel applies baseline browser security headers", () => {
  const headers = config.headers[0].headers;
  const names = new Set(headers.map((header) => header.key.toLowerCase()));
  for (const required of ["content-security-policy", "x-content-type-options", "referrer-policy", "permissions-policy"]) {
    assert.ok(names.has(required), `missing ${required}`);
  }
});
