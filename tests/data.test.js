import test from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  DESTINATIONS,
  FILTERS,
  MOODS,
  filterDestinations,
  normalizeText,
  recommendedForMood,
  resolveItinerary,
} from "../data.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("destination IDs are unique and every image is present locally", async () => {
  const ids = DESTINATIONS.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length, "destination IDs should be unique");

  for (const destination of DESTINATIONS) {
    assert.ok(destination.name, `${destination.id} needs a visible name`);
    assert.ok(destination.coordinates.x >= 0 && destination.coordinates.x <= 100);
    assert.ok(destination.coordinates.y >= 0 && destination.coordinates.y <= 100);
    await access(resolve(root, destination.image));
  }
});

test("every filter and mood points to real destination data", () => {
  const ids = new Set(DESTINATIONS.map(({ id }) => id));
  const categories = new Set(DESTINATIONS.map(({ category }) => category));

  for (const filter of FILTERS.filter(({ id }) => id !== "all")) {
    assert.ok(categories.has(filter.id), `missing destinations for ${filter.id}`);
  }
  for (const mood of MOODS) {
    assert.ok(mood.destinations.length > 0);
    assert.ok(mood.destinations.every((id) => ids.has(id)), `${mood.id} refers to an unknown destination`);
    assert.equal(recommendedForMood(mood.id).length, mood.destinations.length);
  }
});

test("search is forgiving of Uzbek apostrophes and diacritics", () => {
  assert.equal(normalizeText("Mo‘ynoq"), normalizeText("Moynoq"));
  assert.equal(filterDestinations({ query: "Moynoq" })[0].id, "aral");
  assert.equal(filterDestinations({ query: "kulol", category: "craft" })[0].id, "fergana");
  assert.deepEqual(filterDestinations({ query: "yo‘q bunday manzil" }), []);
});

test("category filtering narrows results without mutating the source data", () => {
  const before = DESTINATIONS.map(({ id }) => id);
  const results = filterDestinations({ category: "nature" });
  assert.ok(results.length > 0);
  assert.ok(results.every(({ category }) => category === "nature"));
  assert.deepEqual(DESTINATIONS.map(({ id }) => id), before);
});

test("itinerary summary preserves chosen order, removes duplicates, and ignores unknown IDs", () => {
  const itinerary = resolveItinerary(["khiva", "unknown", "samarkand", "khiva"]);
  assert.deepEqual(itinerary.stops.map(({ id }) => id), ["khiva", "samarkand"]);
  assert.equal(itinerary.count, 2);
  assert.equal(itinerary.days, 4);
});
