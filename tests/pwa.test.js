import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { DESTINATIONS } from "../data.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("the installable app shell caches every local destination image", async () => {
  const [manifestText, worker, html, app] = await Promise.all([
    readFile(resolve(root, "manifest.webmanifest"), "utf8"),
    readFile(resolve(root, "service-worker.js"), "utf8"),
    readFile(resolve(root, "index.html"), "utf8"),
    readFile(resolve(root, "app.js"), "utf8"),
  ]);
  const manifest = JSON.parse(manifestText);

  assert.equal(manifest.lang, "uz-UZ");
  assert.equal(manifest.display, "standalone");
  assert.match(html, /rel="manifest"/);
  assert.match(app, /serviceWorker\.register/);
  for (const destination of DESTINATIONS) {
    assert.ok(worker.includes(`./${destination.image}`), `${destination.image} should be available offline`);
  }
});
