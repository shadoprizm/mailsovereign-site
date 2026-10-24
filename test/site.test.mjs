import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
const robots = await readFile(new URL("../robots.txt", import.meta.url), "utf8");
const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
const privacy = await readFile(new URL("../privacy.html", import.meta.url), "utf8");
const terms = await readFile(new URL("../terms.html", import.meta.url), "utf8");
const refunds = await readFile(new URL("../refunds.html", import.meta.url), "utf8");
const support = await readFile(new URL("../support.html", import.meta.url), "utf8");
const source = await readFile(new URL("../source.html", import.meta.url), "utf8");
const deletion = await readFile(new URL("../account-deletion.html", import.meta.url), "utf8");

test("publishes the Sovereign Mail identity without unsupported launch claims", () => {
  assert.match(html, /Sovereign Mail/);
  assert.match(html, /under active development/i);
  assert.doesNotMatch(html, /trusted by|customers|production-ready/i);
});

test("markets the live provider-first path and labels future work", () => {
  assert.match(html, /Connect the mailboxes you already pay for/);
  assert.match(html, /without moving your websites? or DNS/i);
  assert.match(html, /IMAP Inbox import, exact-address SMTP sending/i);
  assert.match(html, /Automation with guardrails/i);
  assert.match(html, /PLANNED/);
});

test("states the current product boundary instead of promising free mail hosting", () => {
  assert.match(html, /does not yet replace MXroute or create free provider mailboxes/i);
  assert.match(html, /Direct Cloudflare delivery is optional/i);
  assert.doesNotMatch(html, /Every domain, visible at once/);
});

test("uses mailsovereign.com as the canonical public domain", () => {
  for (const source of [html, robots, sitemap]) {
    assert.match(source, /mailsovereign\.com/);
    assert.doesNotMatch(source, /(?<!mail)sovereignmail\.com/);
  }
});

test("links the public site to the authenticated application", () => {
  assert.match(html, /href="https:\/\/app\.mailsovereign\.com"/);
  assert.match(html, /Open Sovereign Mail/);
});

test("publishes paid AI options without gating the AGPL mail product", () => {
  assert.match(html, /\$9/);
  assert.match(html, /\$19/);
  assert.match(html, /AI STARTER/);
  assert.match(html, /AI PRO/);
  assert.match(html, /CAD/);
  assert.match(html, /SELF-HOSTED PRODUCT/);
  assert.match(html, /never human services/i);
  assert.match(html, /app\.mailsovereign\.com\/settings\/ai/);
  assert.doesNotMatch(html, /managed service/i);
  assert.doesNotMatch(html, /settings\/service/);
});

test("publishes the required launch policies and account deletion instructions", () => {
  assert.match(privacy, /customer-owned Sovereign Mail deployment/i);
  assert.match(terms, /AGPL-3\.0-only/);
  assert.match(refunds, /within 14 calendar days/i);
  assert.match(support, /never post credentials/i);
  assert.match(source, /complete product source is public/i);
  assert.match(deletion, /Settings → Account/);
  for (const path of ["privacy", "terms", "refunds", "support", "source", "account-deletion"]) {
    assert.match(sitemap, new RegExp(`mailsovereign\\.com/${path}`));
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
