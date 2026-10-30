import "server-only";

import { cache } from "react";

export type Picture = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type Settings = {
  siteName: string;
  tagline: string;
  slogan: string;
  about: string;
  phoneDisplay: string;
  phoneHref: string;
  instagram: string;
  instagramUrl: string;
  address: string;
  city: string;
  mapsUrl: string;
  heroKicker: string;
  heroTitle: string;
  heroText: string;
  hoursNote: string;
  orderButton: string;
  learnMore: string;
  burgersHeading: string;
  menuLink: string;
  ingredientsLabel: string;
  instagramHeading: string;
  promotionsHeading: string;
  promotionsLink: string;
  navAbout: string;
  navMenu: string;
  navLocation: string;
  callLabel: string;
  orderLabel: string;
  whatsappKicker: string;
  whatsappTitle: string;
  whatsappBody: string;
  whatsappButton: string;
  whatsappLater: string;
  whatsappMessage: string;
  cookieTitle: string;
  cookieBody: string;
  cookieAccept: string;
  fabLabel: string;
  logo: Picture | null;
  heroImage: Picture | null;
  gallery: Picture[];
};

export type Hour = {
  day: string;
  hours: string;
  closed: boolean;
  sortOrder: number;
};

export type Burger = {
  name: string;
  slug: string;
  price: number;
  description: string;
  ingredients: string[];
  image: Picture | null;
  sortOrder: number;
};

export type Extra = {
  name: string;
  detail: string;
  price: number;
  note: string;
  group: string;
  sortOrder: number;
};

export type Drink = {
  name: string;
  price: number;
  sortOrder: number;
};

export type Combo = {
  name: string;
  price: number;
  description: string;
  includes: string[];
  sortOrder: number;
};

export type Promotion = {
  title: string;
  schedule: string;
  price: number;
  description: string;
  image: Picture | null;
  sortOrder: number;
};

export type SiteContent = {
  settings: Settings;
  hours: Hour[];
  burgers: Burger[];
  extras: Extra[];
  drinks: Drink[];
  combos: Combo[];
  promotions: Promotion[];
};

type AssetFile = {
  url?: string;
  details?: { image?: { width?: number; height?: number } };
};

type Asset = {
  sys: { id: string };
  fields?: { title?: string; file?: AssetFile };
};

type Link = { sys?: { id?: string } };

type RawEntry = {
  sys: { contentType: { sys: { id: string } } };
  fields: Record<string, unknown>;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Nedostaje ${name}`);
  return value;
}

function picture(link: Link | undefined, assets: Asset[]): Picture | null {
  const asset = assets.find((item) => item.sys.id === link?.sys?.id);
  const file = asset?.fields?.file;
  if (!file?.url) return null;
  return {
    url: file.url.startsWith("//") ? `https:${file.url}` : file.url,
    alt: asset?.fields?.title ?? "",
    width: file.details?.image?.width ?? 1200,
    height: file.details?.image?.height ?? 900,
  };
}

function pictures(links: Link[] | undefined, assets: Asset[]) {
  return (links ?? []).flatMap((link) => {
    const image = picture(link, assets);
    return image ? [image] : [];
  });
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function price(value: unknown) {
  return typeof value === "number" ? value : 0;
}

function order(value: unknown) {
  return typeof value === "number" ? value : 0;
}

function list(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function byOrder<T extends { sortOrder: number }>(items: T[]) {
  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export const getSite = cache(async (): Promise<SiteContent> => {
  const space = requiredEnv("CONTENTFUL_SPACE_ID");
  const token = requiredEnv("CONTENTFUL_DELIVERY_TOKEN");
  const environment = process.env.CONTENTFUL_ENVIRONMENT || "master";
  const url = new URL(
    `https://cdn.contentful.com/spaces/${space}/environments/${environment}/entries`,
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("include", "2");
  url.searchParams.set("limit", "200");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Contentful nije vratio sadržaj (${response.status})`);
  }

  const data = (await response.json()) as {
    items: RawEntry[];
    includes?: { Asset?: Asset[] };
  };
  const assets = data.includes?.Asset ?? [];
  const ofType = (id: string) => data.items.filter((entry) => entry.sys.contentType.sys.id === id);

  const settingsEntry = ofType("siteSettings")[0];
  if (!settingsEntry) throw new Error("U Contentfulu nema postavki sajta.");
  const fields = settingsEntry.fields;

  const settings: Settings = {
    siteName: text(fields.siteName),
    tagline: text(fields.tagline),
    slogan: text(fields.slogan),
    about: text(fields.about),
    phoneDisplay: text(fields.phoneDisplay),
    phoneHref: text(fields.phoneHref),
    instagram: text(fields.instagram),
    instagramUrl: text(fields.instagramUrl),
    address: text(fields.address),
    city: text(fields.city),
    mapsUrl: text(fields.mapsUrl),
    heroKicker: text(fields.heroKicker),
    heroTitle: text(fields.heroTitle),
    heroText: text(fields.heroText),
    hoursNote: text(fields.hoursNote),
    orderButton: text(fields.orderButton),
    learnMore: text(fields.learnMore),
    burgersHeading: text(fields.burgersHeading),
    menuLink: text(fields.menuLink),
    ingredientsLabel: text(fields.ingredientsLabel),
    instagramHeading: text(fields.instagramHeading),
    promotionsHeading: text(fields.promotionsHeading),
    promotionsLink: text(fields.promotionsLink),
    navAbout: text(fields.navAbout),
    navMenu: text(fields.navMenu),
    navLocation: text(fields.navLocation),
    callLabel: text(fields.callLabel),
    orderLabel: text(fields.orderLabel),
    whatsappKicker: text(fields.whatsappKicker),
    whatsappTitle: text(fields.whatsappTitle),
    whatsappBody: text(fields.whatsappBody),
    whatsappButton: text(fields.whatsappButton),
    whatsappLater: text(fields.whatsappLater),
    whatsappMessage: text(fields.whatsappMessage),
    cookieTitle: text(fields.cookieTitle),
    cookieBody: text(fields.cookieBody),
    cookieAccept: text(fields.cookieAccept),
    fabLabel: text(fields.fabLabel),
    logo: picture(fields.logo as Link, assets),
    heroImage: picture(fields.heroImage as Link, assets),
    gallery: pictures(fields.gallery as Link[], assets),
  };

  return {
    settings,
    hours: byOrder(
      ofType("openingHour").map((entry) => ({
        day: text(entry.fields.day),
        hours: text(entry.fields.hours),
        closed: entry.fields.closed === true,
        sortOrder: order(entry.fields.sortOrder),
      })),
    ),
    burgers: byOrder(
      ofType("burger").map((entry) => ({
        name: text(entry.fields.name),
        slug: text(entry.fields.slug),
        price: price(entry.fields.price),
        description: text(entry.fields.description),
        ingredients: list(entry.fields.ingredients),
        image: picture(entry.fields.image as Link, assets),
        sortOrder: order(entry.fields.sortOrder),
      })),
    ),
    extras: byOrder(
      ofType("extra").map((entry) => ({
        name: text(entry.fields.name),
        detail: text(entry.fields.detail),
        price: price(entry.fields.price),
        note: text(entry.fields.note),
        group: text(entry.fields.group),
        sortOrder: order(entry.fields.sortOrder),
      })),
    ),
    drinks: byOrder(
      ofType("drink").map((entry) => ({
        name: text(entry.fields.name),
        price: price(entry.fields.price),
        sortOrder: order(entry.fields.sortOrder),
      })),
    ),
    combos: byOrder(
      ofType("combo").map((entry) => ({
        name: text(entry.fields.name),
        price: price(entry.fields.price),
        description: text(entry.fields.description),
        includes: list(entry.fields.includes),
        sortOrder: order(entry.fields.sortOrder),
      })),
    ),
    promotions: byOrder(
      ofType("promotion").map((entry) => ({
        title: text(entry.fields.title),
        schedule: text(entry.fields.schedule),
        price: price(entry.fields.price),
        description: text(entry.fields.description),
        image: picture(entry.fields.image as Link, assets),
        sortOrder: order(entry.fields.sortOrder),
      })),
    ),
  };
});
