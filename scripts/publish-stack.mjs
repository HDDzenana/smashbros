import fs from "node:fs";
import path from "node:path";

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENV = process.env.CONTENTFUL_ENVIRONMENT || "master";
const LOCALE = "en-US";
const base = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`;
const PHOTOS = path.resolve(import.meta.dirname, "../content/photos/parts");

function loc(value) {
  return { [LOCALE]: value };
}

async function api(url, { method = "GET", body, version, headers = {} } = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/vnd.contentful.management.v1+json",
      ...(version != null ? { "X-Contentful-Version": String(version) } : {}),
      ...headers,
    },
    body: body == null ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${method} ${url} -> ${response.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

async function publish(collection, id, version) {
  return api(`${base}/${collection}/${id}/published`, { method: "PUT", version });
}

const visibleField = {
  id: "visible",
  name: "Prikaži",
  type: "Boolean",
  localized: false,
  required: false,
  validations: [],
  disabled: false,
  omitted: false,
  defaultValue: { [LOCALE]: true },
};

const promotion = await api(`${base}/content_types/promotion`);
if (!promotion.fields.some((field) => field.id === "visible")) {
  const updated = await api(`${base}/content_types/promotion`, {
    method: "PUT",
    version: promotion.sys.version,
    body: {
      name: promotion.name,
      description: promotion.description,
      displayField: promotion.displayField,
      fields: [...promotion.fields, visibleField],
    },
  });
  await publish("content_types", "promotion", updated.sys.version);
  console.log("akcija dobila Prikaži");
}

const entries = await api(`${base}/entries?content_type=promotion&limit=100`);
for (const entry of entries.items) {
  if (entry.fields.visible?.[LOCALE] === true) continue;
  const updated = await api(`${base}/entries/${entry.sys.id}`, {
    method: "PUT",
    version: entry.sys.version,
    body: { fields: { ...entry.fields, visible: loc(true) } },
  });
  await publish("entries", entry.sys.id, updated.sys.version);
  console.log(`akcija uključena: ${entry.fields.title?.[LOCALE]}`);
}

const partFields = [
  { id: "name", name: "Naziv", type: "Symbol", localized: false, required: true, validations: [], disabled: false, omitted: false },
  { id: "image", name: "Slika", type: "Link", linkType: "Asset", localized: false, required: true, validations: [{ linkMimetypeGroup: ["image"] }], disabled: false, omitted: false },
  visibleField,
  { id: "sortOrder", name: "Redoslijed", type: "Integer", localized: false, required: true, validations: [], disabled: false, omitted: false },
];

let partType;
try {
  partType = await api(`${base}/content_types/burgerPart`);
} catch (error) {
  if (!String(error.message).includes("404")) throw error;
}

if (!partType) {
  partType = await api(`${base}/content_types/burgerPart`, {
    method: "PUT",
    body: {
      name: "Dio burgera",
      description: "Jedan sloj na naslovnoj. Isključi Prikaži da nestane sa sajta.",
      displayField: "name",
      fields: partFields,
    },
  });
  partType = await publish("content_types", "burgerPart", partType.sys.version);
  console.log("model Dio burgera kreiran");
}

async function upload(fileName, title) {
  const assets = await api(`${base}/assets?limit=200`);
  const existing = assets.items.find((asset) => asset.fields.title?.[LOCALE] === title);
  if (existing) return existing.sys.id;

  const bytes = fs.readFileSync(path.join(PHOTOS, fileName));
  const upload = await fetch(`https://upload.contentful.com/spaces/${SPACE}/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/octet-stream" },
    body: bytes,
  });
  if (!upload.ok) throw new Error(`Upload ${fileName} ${upload.status} ${await upload.text()}`);
  const uploadId = (await upload.json()).sys.id;

  let asset = await api(`${base}/assets`, {
    method: "POST",
    body: {
      fields: {
        title: loc(title),
        file: loc({
          contentType: "image/jpeg",
          fileName,
          uploadFrom: { sys: { type: "Link", linkType: "Upload", id: uploadId } },
        }),
      },
    },
  });
  await api(`${base}/assets/${asset.sys.id}/files/${LOCALE}/process`, { method: "PUT", version: asset.sys.version });
  for (let attempt = 0; attempt < 40; attempt += 1) {
    asset = await api(`${base}/assets/${asset.sys.id}`);
    if (asset.fields.file?.[LOCALE]?.url) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  asset = await publish("assets", asset.sys.id, asset.sys.version);
  console.log(`slika ${title}`);
  return asset.sys.id;
}

const bun = await upload("pecivo.jpg", "Pecivo");
const cheddar = await upload("cheddar.jpg", "Cheddar");
const tomato = await upload("paradajz.jpg", "Paradajz");
const onion = await upload("luk.jpg", "Ljubičasti luk");
const patty = await upload("meso.jpg", "Meso");

const parts = [
  ["Gornje pecivo", bun, 1],
  ["Cheddar", cheddar, 2],
  ["Paradajz", tomato, 3],
  ["Ljubičasti luk", onion, 4],
  ["Meso", patty, 5],
  ["Donje pecivo", bun, 6],
];

const current = await api(`${base}/entries?content_type=burgerPart&limit=100`);
for (const [name, assetId, sortOrder] of parts) {
  if (current.items.some((entry) => entry.fields.name?.[LOCALE] === name)) {
    console.log(`sloj ${name} već postoji`);
    continue;
  }
  const created = await api(`${base}/entries`, {
    method: "POST",
    headers: { "X-Contentful-Content-Type": "burgerPart" },
    body: {
      fields: {
        name: loc(name),
        image: loc({ sys: { type: "Link", linkType: "Asset", id: assetId } }),
        visible: loc(true),
        sortOrder: loc(sortOrder),
      },
    },
  });
  await publish("entries", created.sys.id, created.sys.version);
  console.log(`sloj ${name} objavljen`);
}
