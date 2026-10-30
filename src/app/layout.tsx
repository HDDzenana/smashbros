import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito } from "next/font/google";
import { OrderWidgets } from "@/components/order-widgets";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSite } from "@/lib/contentful";
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
  return {
    title: {
      default: `${settings.siteName} · ${settings.tagline}`,
      template: `%s · ${settings.siteName}`,
    },
    description: settings.heroText,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { settings } = await getSite();
  const orderHref = whatsappHref(settings.phoneHref, settings.whatsappMessage);

  return (
    <html lang="bs" className={sans.variable} data-scroll-behavior="smooth">
      <body className="bg-paper font-sans text-ink antialiased">
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
        />
      </body>
    </html>
  );
}
