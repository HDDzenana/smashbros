import fs from "node:fs";
import path from "node:path";

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENV = process.env.CONTENTFUL_ENVIRONMENT || "master";
const LOCALE = "en-US";
const ROOT = path.resolve(import.meta.dirname, "..");
const PHOTOS = path.join(ROOT, "content", "photos");

if (!SPACE || !TOKEN) {
  console.error("Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN");
  process.exit(1);
}

const base = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`;

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
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(`${method} ${url} -> ${response.status} ${text}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function loc(value) {
  return { [LOCALE]: value };
}

function assetLink(id) {
  return { sys: { type: "Link", linkType: "Asset", id } };
}

function isPublished(entity) {
  return (
    entity.sys.publishedVersion != null &&
    entity.sys.version === entity.sys.publishedVersion + 1
  );
}

async function publish(collection, id, version) {
  return api(`${base}/${collection}/${id}/published`, { method: "PUT", version });
}

const symbol = (id, name, extra = {}) => ({
  id,
  name,
  type: "Symbol",
  localized: false,
  required: false,
  validations: [],
  ...extra,
});

const text = (id, name, extra = {}) => ({
  id,
  name,
  type: "Text",
  localized: false,
  required: false,
  validations: [],
  ...extra,
});

const number = (id, name, extra = {}) => ({
  id,
  name,
  type: "Number",
  localized: false,
  required: false,
  validations: [{ range: { min: 0 } }],
  ...extra,
});

const integer = (id, name, extra = {}) => ({
  id,
  name,
  type: "Integer",
  localized: false,
  required: false,
  validations: [],
  ...extra,
});

const boolean = (id, name, extra = {}) => ({
  id,
  name,
  type: "Boolean",
  localized: false,
  required: false,
  ...extra,
});

const image = (id, name, extra = {}) => ({
  id,
  name,
  type: "Link",
  linkType: "Asset",
  localized: false,
  required: false,
  validations: [{ linkMimetypeGroup: ["image"] }],
  ...extra,
});

const symbols = (id, name, extra = {}) => ({
  id,
  name,
  type: "Array",
  localized: false,
  required: false,
  items: { type: "Symbol", validations: [] },
  ...extra,
});

const images = (id, name) => ({
  id,
  name,
  type: "Array",
  localized: false,
  required: false,
  items: {
    type: "Link",
    linkType: "Asset",
    validations: [{ linkMimetypeGroup: ["image"] }],
  },
});

const models = [
  {
    id: "siteSettings",
    name: "Postavke sajta",
    description: "Naziv, kontakt, naslovnica i galerija. Jedan unos.",
    displayField: "siteName",
    fields: [
      symbol("siteName", "Naziv", { required: true }),
      symbol("tagline", "Kratki opis", { required: true }),
      symbol("slogan", "Slogan", { required: true }),
      text("about", "O nama", { required: true }),
      symbol("phoneDisplay", "Telefon", { required: true }),
      symbol("phoneHref", "Telefon link", { required: true }),
      symbol("instagram", "Instagram", { required: true }),
      symbol("instagramUrl", "Instagram link", { required: true }),
      symbol("address", "Adresa", { required: true }),
      symbol("city", "Grad", { required: true }),
      symbol("mapsUrl", "Mapa", { required: true }),
      symbol("heroKicker", "Naslovnica, nadnaslov", { required: true }),
      symbol("heroTitle", "Naslovnica, naslov", { required: true }),
      text("heroText", "Naslovnica, tekst", { required: true }),
      text("hoursNote", "Napomena o radnom vremenu"),
      image("logo", "Logo", { required: true }),
      image("heroImage", "Naslovna fotografija", { required: true }),
      images("gallery", "Galerija"),
    ],
  },
  {
    id: "openingHour",
    name: "Radno vrijeme",
    description: "Jedan red po danu.",
    displayField: "day",
    fields: [
      symbol("day", "Dan", { required: true }),
      symbol("hours", "Vrijeme", { required: true }),
      boolean("closed", "Zatvoreno", { required: true }),
      integer("sortOrder", "Redoslijed", { required: true }),
    ],
  },
  {
    id: "burger",
    name: "Burger",
    description: "Smash burgeri sa cijenom i sastojcima.",
    displayField: "name",
    fields: [
      symbol("name", "Naziv", { required: true }),
      symbol("slug", "Slug", { required: true, validations: [{ unique: true }] }),
      number("price", "Cijena (KM)", { required: true }),
      text("description", "Opis", { required: true }),
      symbols("ingredients", "Sastojci", { required: true }),
      image("image", "Fotografija", { required: true }),
      integer("sortOrder", "Redoslijed", { required: true }),
    ],
  },
  {
    id: "extra",
    name: "Dodatak",
    description: "Prilozi, dodaci i sosovi.",
    displayField: "name",
    fields: [
      symbol("name", "Naziv", { required: true }),
      symbol("detail", "Količina"),
      number("price", "Cijena (KM)", { required: true }),
      text("note", "Napomena"),
      symbol("group", "Grupa", {
        required: true,
        validations: [{ in: ["Prilog", "Dodatak", "Sos"] }],
      }),
      integer("sortOrder", "Redoslijed", { required: true }),
    ],
  },
  {
    id: "drink",
    name: "Piće",
    description: "Pića sa cijenom.",
    displayField: "name",
    fields: [
      symbol("name", "Naziv", { required: true }),
      number("price", "Cijena (KM)", { required: true }),
      integer("sortOrder", "Redoslijed", { required: true }),
    ],
  },
  {
    id: "combo",
    name: "Combo",
    description: "Stalni combo meni.",
    displayField: "name",
    fields: [
      symbol("name", "Naziv", { required: true }),
      number("price", "Cijena (KM)", { required: true }),
      text("description", "Opis", { required: true }),
      symbols("includes", "Uključuje", { required: true }),
      integer("sortOrder", "Redoslijed", { required: true }),
    ],
  },
  {
    id: "promotion",
    name: "Akcija",
    description: "Sedmične akcije.",
    displayField: "title",
    fields: [
      symbol("title", "Naslov", { required: true }),
      symbol("schedule", "Kad važi", { required: true }),
      number("price", "Cijena (KM)", { required: true }),
      text("description", "Opis", { required: true }),
      image("image", "Plakat"),
      integer("sortOrder", "Redoslijed", { required: true }),
    ],
  },
];

async function ensureModel(model) {
  let current;
  try {
    current = await api(`${base}/content_types/${model.id}`);
  } catch (error) {
    if (error.status !== 404) throw error;
  }

  if (!current) {
    current = await api(`${base}/content_types/${model.id}`, {
      method: "PUT",
      body: {
        name: model.name,
        description: model.description,
        displayField: model.displayField,
        fields: model.fields,
      },
    });
    current = await publish("content_types", model.id, current.sys.version);
    console.log(`model ${model.id} kreiran`);
    return;
  }

  console.log(`model ${model.id} već postoji`);
  if (!isPublished(current)) {
    await publish("content_types", model.id, current.sys.version);
  }
}

async function listAll(collection) {
  const items = [];
  let skip = 0;
  for (;;) {
    const page = await api(`${base}/${collection}?limit=100&skip=${skip}`);
    items.push(...page.items);
    skip += page.items.length;
    if (skip >= page.total) return items;
  }
}

async function uploadAsset(fileName, title) {
  const existing = (await listAll("assets")).find((asset) => asset.fields.title?.[LOCALE] === title);
  if (existing) {
    if (!isPublished(existing)) await publish("assets", existing.sys.id, existing.sys.version);
    console.log(`slika ${title} već postoji`);
    return existing.sys.id;
  }

  const bytes = fs.readFileSync(path.join(PHOTOS, fileName));
  const upload = await fetch(`https://upload.contentful.com/spaces/${SPACE}/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/octet-stream",
    },
    body: bytes,
  });
  const uploadText = await upload.text();
  if (!upload.ok) throw new Error(`Upload ${fileName} ${upload.status} ${uploadText}`);
  const uploadId = JSON.parse(uploadText).sys.id;

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

  await api(`${base}/assets/${asset.sys.id}/files/${LOCALE}/process`, {
    method: "PUT",
    version: asset.sys.version,
  });

  for (let attempt = 0; attempt < 40; attempt += 1) {
    asset = await api(`${base}/assets/${asset.sys.id}`);
    if (asset.fields.file?.[LOCALE]?.url) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!asset.fields.file?.[LOCALE]?.url) throw new Error(`Obrada slike nije gotova: ${title}`);

  asset = await publish("assets", asset.sys.id, asset.sys.version);
  console.log(`slika ${title} objavljena`);
  return asset.sys.id;
}

async function ensureEntry(contentType, label, match, fields) {
  const entries = await api(`${base}/entries?content_type=${contentType}&limit=200`);
  const found = entries.items.find((entry) => match(entry.fields));
  if (found) {
    if (!isPublished(found)) await publish("entries", found.sys.id, found.sys.version);
    console.log(`${contentType} ${label} već postoji`);
    return found.sys.id;
  }

  const created = await api(`${base}/entries`, {
    method: "POST",
    headers: { "X-Contentful-Content-Type": contentType },
    body: { fields },
  });
  await publish("entries", created.sys.id, created.sys.version);
  console.log(`${contentType} ${label} objavljen`);
  return created.sys.id;
}

const photos = {};

async function main() {
  for (const model of models) await ensureModel(model);

  const files = {
    logo: ["logo.jpg", "Smash Bros logo"],
    oridzidzi: ["oridzidzi.jpg", "Oridžidži"],
    medeni: ["medeni.jpg", "Medeni"],
    huja: ["huja.jpg", "Huja"],
    meza: ["meza.jpg", "Meza"],
    hero: ["hero.jpg", "Smash burger, prerez"],
    preliv: ["preliv.jpg", "Preliv preko burgera"],
    utorak: ["promo-utorak.jpg", "Akcija utorak"],
    cetvrtak: ["promo-cetvrtak.jpg", "Akcija četvrtak"],
    subota: ["promo-subota.jpg", "Akcija subota"],
  };

  for (const [key, [fileName, title]] of Object.entries(files)) {
    photos[key] = await uploadAsset(fileName, title);
  }

  const same = (field, value) => (fields) => fields[field]?.[LOCALE] === value;

  await ensureEntry("siteSettings", "Smash Bros", same("siteName", "Smash Bros"), {
    siteName: loc("Smash Bros"),
    tagline: loc("Smash burgeri na Grbavičkoj"),
    slogan: loc("Nije sramota prste polizat'"),
    about: loc(
      "Smash Bros je burger joint na Grbavičkoj. Premium meso ide na žar, smrska se dok ne dobije koricu, pa se složi u brioche pecivo sa dva cheddara. Četiri burgera imaju svoja imena: Oridžidži, Medeni, Huja i Meza. Sos ide uz ime, a prsti su dozvoljeni.",
    ),
    phoneDisplay: loc("062 444 904"),
    phoneHref: loc("tel:+38762444904"),
    instagram: loc("@smashbros_bih"),
    instagramUrl: loc("https://www.instagram.com/smashbros_bih/"),
    address: loc("Grbavička bb"),
    city: loc("71000 Sarajevo"),
    mapsUrl: loc("https://www.google.com/maps/search/?api=1&query=Grbavi%C4%8Dka+bb+Sarajevo"),
    heroKicker: loc("Grbavička bb · Sarajevo"),
    heroTitle: loc("Nije sramota prste polizat'"),
    heroText: loc(
      "Svježe smrskano meso, brioche i sosovi iz kuće. Četiri burgera, pomfrit i piće. Combo je 15 KM.",
    ),
    hoursNote: loc("Ponedjeljkom ne radimo. Ako si u prolazu, nazovi prije nego kreneš."),
    logo: loc(assetLink(photos.logo)),
    heroImage: loc(assetLink(photos.hero)),
    gallery: loc([photos.meza, photos.medeni, photos.preliv, photos.huja].map(assetLink)),
  });

  const hours = [
    ["Ponedjeljak", "Zatvoreno", true],
    ["Utorak", "12:00–23:00", false],
    ["Srijeda", "12:00–23:00", false],
    ["Četvrtak", "12:00–23:00", false],
    ["Petak", "12:00–23:00", false],
    ["Subota", "16:00–23:00", false],
    ["Nedjelja", "16:00–23:00", false],
  ];
  for (const [index, [day, time, closed]] of hours.entries()) {
    await ensureEntry("openingHour", day, same("day", day), {
      day: loc(day),
      hours: loc(time),
      closed: loc(closed),
      sortOrder: loc(index + 1),
    });
  }

  const burgers = [
    {
      slug: "oridzidzi",
      name: "Oridžidži",
      price: 11,
      image: photos.oridzidzi,
      description:
        "Klasik. Kečap, majonez i senf na dvostrukom cheddaru, uz kiseli krastavac, ljubičasti luk i iceberg.",
      ingredients: [
        "brioche pecivo",
        "premium meso 150g",
        "2x cheddar sir",
        "kečap",
        "majonez",
        "senf",
        "kiseli krastavci",
        "ljubičasti luk",
        "iceberg salata",
      ],
    },
    {
      slug: "medeni",
      name: "Medeni",
      price: 11,
      image: photos.medeni,
      description: "Cheese sos i honey sos, kiseli krastavac i hrskavi luk. Slatko, slano i ljepljivo.",
      ingredients: [
        "brioche pecivo",
        "premium meso 150g",
        "2x cheddar sir",
        "cheese sos",
        "honey sos",
        "kiseli krastavci",
        "hrskavi luk",
      ],
    },
    {
      slug: "huja",
      name: "Huja",
      price: 11,
      image: photos.huja,
      description: "Za one koji vole da pecka. Cheese sos, sriracha mayo i sweet chilly, pa luk i iceberg.",
      ingredients: [
        "brioche pecivo",
        "premium meso 150g",
        "2x cheddar sir",
        "cheese sos",
        "sriracha mayo",
        "sweet chilly sos",
        "kiseli krastavci",
        "ljubičasti luk",
        "iceberg salata",
      ],
    },
    {
      slug: "meza",
      name: "Meza",
      price: 11.5,
      image: photos.meza,
      description: "Najbogatiji od četiri. BBQ, tajni sos, ljubičasti luk i hrskavi luk preko cheddara.",
      ingredients: [
        "brioche pecivo",
        "premium meso 150g",
        "2x cheddar sir",
        "bbq",
        "tajni sos",
        "kiseli krastavci",
        "ljubičasti luk",
        "hrskavi luk",
      ],
    },
  ];

  for (const [index, burger] of burgers.entries()) {
    await ensureEntry("burger", burger.slug, same("slug", burger.slug), {
      name: loc(burger.name),
      slug: loc(burger.slug),
      price: loc(burger.price),
      description: loc(burger.description),
      ingredients: loc(burger.ingredients),
      image: loc(assetLink(burger.image)),
      sortOrder: loc(index + 1),
    });
  }

  const extras = [
    ["Pomfrit", "120g", 3, "Prilog", ""],
    ["Onion rings", "5 kom", 4, "Prilog", ""],
    ["Onion rings", "10 kom", 7, "Prilog", ""],
    ["Extra meso", "premium meso 75g", 3, "Dodatak", ""],
    ["Extra sir", "cheddar", 0.5, "Dodatak", ""],
    [
      "Sos",
      "porcija",
      1,
      "Sos",
      "Majonez, senf, cheese, honey, sriracha, sweet chilly, bbq ili dimljeni majonez.",
    ],
  ];
  for (const [index, [name, detail, price, group, note]] of extras.entries()) {
    await ensureEntry("extra", `${name} ${detail}`, (fields) => {
      return fields.name?.[LOCALE] === name && fields.detail?.[LOCALE] === detail;
    }, {
      name: loc(name),
      detail: loc(detail),
      price: loc(price),
      note: loc(note),
      group: loc(group),
      sortOrder: loc(index + 1),
    });
  }

  const drinks = [
    ["Gazirani sokovi", 3],
    ["Negazirani sokovi", 3],
    ["Kisela voda", 2],
    ["Voda", 2],
  ];
  for (const [index, [name, price]] of drinks.entries()) {
    await ensureEntry("drink", name, same("name", name), {
      name: loc(name),
      price: loc(price),
      sortOrder: loc(index + 1),
    });
  }

  await ensureEntry("combo", "Combo", same("name", "Combo"), {
    name: loc("Combo"),
    price: loc(15),
    description: loc("Burger koji izabereš, piće koje izabereš i pomfrit."),
    includes: loc(["Burger po izboru", "Piće po izboru", "Pomfrit"]),
    sortOrder: loc(1),
  });

  const promotions = [
    {
      title: "Oridžidži",
      schedule: "Svakog utorka",
      price: 8.5,
      image: photos.utorak,
      description:
        "Oridžidži za 8.50 KM. Brioche, 2x75g premium mesa, dva cheddara, kečap, majonez, senf, kiseli krastavci, ljubičasti luk i iceberg.",
    },
    {
      title: "Svaki za deset",
      schedule: "Svakog četvrtka",
      price: 10,
      image: photos.cetvrtak,
      description: "Oridžidži, Medeni, Huja i Meza tog dana koštaju 10 KM.",
    },
    {
      title: "Combo subota",
      schedule: "Svake subote",
      price: 13.5,
      image: photos.subota,
      description: "Burger po izboru, pomfrit 120g i piće po izboru za 13.50 KM.",
    },
  ];
  for (const [index, promo] of promotions.entries()) {
    await ensureEntry("promotion", promo.title, same("title", promo.title), {
      title: loc(promo.title),
      schedule: loc(promo.schedule),
      price: loc(promo.price),
      description: loc(promo.description),
      image: loc(assetLink(promo.image)),
      sortOrder: loc(index + 1),
    });
  }

  console.log("Gotovo. Modeli, slike i sadržaj su objavljeni.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
