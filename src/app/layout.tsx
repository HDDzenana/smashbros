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

function whatsappHref(phoneHref: string) {
  const digits = phoneHref.replace(/\D/g, "");
  const text = encodeURIComponent("Zdravo Smash Bros, želim naručiti.");
  return `https://wa.me/${digits}?text=${text}`;
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
  const orderHref = whatsappHref(settings.phoneHref);

  return (
    <html lang="bs" className={sans.variable} data-scroll-behavior="smooth">
      <body className="bg-paper font-sans text-ink antialiased">
        <SiteHeader siteName={settings.siteName} phoneHref={settings.phoneHref} whatsappHref={orderHref} logoUrl={settings.logo?.url ?? null} />
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
        />
        <OrderWidgets whatsappHref={orderHref} />
      </body>
    </html>
  );
}
