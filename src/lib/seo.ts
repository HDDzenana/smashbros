import type { Metadata } from "next";
import type { Hour, SiteContent } from "@/lib/contentful";

const days: Record<string, string> = {
  ponedjeljak: "Monday",
  utorak: "Tuesday",
  srijeda: "Wednesday",
  cetvrtak: "Thursday",
  četvrtak: "Thursday",
  petak: "Friday",
  subota: "Saturday",
  nedjelja: "Sunday",
};

export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return value || null;
}

export const searchPhrases = [
  "Smash Burger Sarajevo",
  "best burger in Sarajevo",
  "order online",
  "naruči burger",
  "Grbavica burger",
  "smash burger Grbavica",
  "burger za ponijeti Sarajevo",
  "burger Grbavička",
];

export function pageMetadata(title: string, description: string, path: string, extra: string[] = []): Metadata {
  const base = siteUrl();
  const keywords = [...searchPhrases, ...extra];
  return {
    title,
    description,
    keywords,
    alternates: base ? { canonical: path } : undefined,
    openGraph: {
      title,
      description,
      url: base ? `${base}${path}` : undefined,
      locale: "bs_BA",
      type: "website",
    },
  };
}

function clock(value: string) {
  const match = value.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  if (!match) return null;
  return { opens: match[1], closes: match[2] };
}

export function restaurantJsonLd(site: SiteContent) {
  const { settings, hours, burgers, drinks, combos } = site;
  const base = siteUrl();
  const postal = settings.city.match(/\d{5}/)?.[0] ?? "";
  const locality = settings.city.replace(/\d{5}/, "").trim();

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.siteName,
    alternateName: ["Smash Burger Sarajevo", "Grbavica burger", "Smash Bros Grbavica"],
    description: settings.about || settings.heroText,
    servesCuisine: "Smash burgeri",
    priceRange: "KM",
    telephone: settings.phoneHref.replace("tel:", ""),
    image: settings.heroImage?.url,
    url: base ?? undefined,
    hasMenu: base ? `${base}/meni` : undefined,
    sameAs: settings.instagramUrl ? [settings.instagramUrl] : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: locality || settings.city,
      postalCode: postal || undefined,
      addressCountry: "BA",
    },
    openingHoursSpecification: hours.flatMap((row: Hour) => {
      if (row.closed) return [];
      const time = clock(row.hours);
      const day = days[row.day.toLowerCase()];
      if (!time || !day) return [];
      return [{ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${day}`, ...time }];
    }),
    menu: {
      "@type": "Menu",
      name: settings.menuTitle || "Meni",
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: settings.burgersHeading || "Burgeri",
          hasMenuItem: burgers.map((burger) => ({
            "@type": "MenuItem",
            name: burger.name,
            description: burger.description || burger.ingredients.join(", "),
            offers: { "@type": "Offer", price: burger.price, priceCurrency: "BAM" },
          })),
        },
        ...combos.map((combo) => ({
          "@type": "MenuSection",
          name: combo.name,
          hasMenuItem: [
            {
              "@type": "MenuItem",
              name: combo.name,
              description: combo.description,
              offers: { "@type": "Offer", price: combo.price, priceCurrency: "BAM" },
            },
          ],
        })),
        {
          "@type": "MenuSection",
          name: settings.drinksHeading || "Piće",
          hasMenuItem: drinks.map((drink) => ({
            "@type": "MenuItem",
            name: drink.name,
            offers: { "@type": "Offer", price: drink.price, priceCurrency: "BAM" },
          })),
        },
      ],
    },
  };
}
