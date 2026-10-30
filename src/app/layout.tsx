import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito } from "next/font/google";
import { OrderStrip } from "@/components/order-strip";
import { OrderWidgets } from "@/components/order-widgets";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSite } from "@/lib/contentful";
import { pageMetadata, restaurantJsonLd, siteUrl } from "@/lib/seo";
import "./globals.css";

const sans = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700", "800"],
  variable: "--font-nunito",
});

function whatsappHref(phoneHref: string, message: string) {
  const digits = phoneHref.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite();
  const description = `${settings.heroText || settings.about} Smash burger Sarajevo na Grbavici. Naruči burger online, za ponijeti.`;
  const base = siteUrl();
  return {
    ...pageMetadata(`${settings.siteName} · ${settings.tagline}`, description, "/"),
    metadataBase: base ? new URL(base) : undefined,
    title: {
      default: `Smash Burger Sarajevo · ${settings.siteName}`,
      template: `%s · ${settings.siteName}`,
    },
    description,
    applicationName: settings.siteName,
    authors: [{ name: settings.siteName }],
    openGraph: {
      title: `${settings.siteName} · ${settings.tagline}`,
      description,
      locale: "bs_BA",
      type: "website",
      siteName: settings.siteName,
      images: settings.heroImage ? [{ url: settings.heroImage.url, alt: settings.heroImage.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description,
      images: settings.heroImage ? [settings.heroImage.url] : undefined,
    },
    robots: { index: true, follow: true },
    icons: settings.logo ? { icon: settings.logo.url } : undefined,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const site = await getSite();
  const { settings } = site;
  const orderHref = whatsappHref(settings.phoneHref, settings.whatsappMessage);
  const jsonLd = JSON.stringify(restaurantJsonLd(site)).replace(/</g, "\\u003c");

  return (
    <html lang="bs" className={sans.variable} data-scroll-behavior="smooth">
      <body className="bg-paper font-sans text-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <SiteHeader
          siteName={settings.siteName}
          phoneHref={settings.phoneHref}
          whatsappHref={orderHref}
          logoUrl={settings.logo?.url ?? null}
          labels={{
            about: settings.navAbout,
            menu: settings.navMenu,
            location: settings.navLocation,
            call: settings.callLabel,
            order: settings.orderLabel,
          }}
        />
        {children}
        <OrderStrip words={settings.orderStrip} pill={settings.orderButton} href={orderHref} />
        <SiteFooter
          siteName={settings.siteName}
          address={settings.address}
          city={settings.city}
          phoneDisplay={settings.phoneDisplay}
          phoneHref={settings.phoneHref}
          instagram={settings.instagram}
          instagramUrl={settings.instagramUrl}
          whatsappHref={orderHref}
          labels={{
            about: settings.navAbout,
            menu: settings.navMenu,
            promotions: settings.promotionsHeading,
            location: settings.navLocation,
            order: settings.whatsappButton,
          }}
          footerLabel={settings.footerLabel}
        />
        <OrderWidgets
          whatsappHref={orderHref}
          kicker={settings.whatsappKicker}
          title={settings.whatsappTitle}
          body={settings.whatsappBody}
          button={settings.whatsappButton}
          later={settings.whatsappLater}
          cookieTitle={settings.cookieTitle}
          cookieBody={settings.cookieBody}
          cookieAccept={settings.cookieAccept}
          fabLabel={settings.fabLabel}
          showOrderPopup={settings.showOrderPopup}
          closeLabel={settings.closeLabel}
        />
      </body>
    </html>
  );
}
