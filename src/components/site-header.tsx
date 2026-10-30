"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const linkHrefs = [
  { href: "/#o-nama", key: "about" },
  { href: "/meni", key: "menu" },
  { href: "/lokacija", key: "location" },
] as const;

export function SiteHeader({
  siteName,
  phoneHref,
  whatsappHref,
  logoUrl,
  labels,
}: {
  siteName: string;
  phoneHref: string;
  whatsappHref: string;
  logoUrl: string | null;
  labels: { about: string; menu: string; location: string; call: string; order: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [first, second] = siteName.split(" ");

  return (
    <header className="sticky top-0 z-30 bg-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 md:grid-cols-[1fr_auto_1fr]">
        <nav className="hidden items-center gap-6 md:flex" aria-label="Glavna navigacija">
          {linkHrefs.map((link) => (
            <Link key={link.href} href={link.href} className={`text-[11px] font-extrabold uppercase tracking-[0.16em] ${pathname === link.href ? "text-blue" : "text-ink"}`}>
              {labels[link.key]}
            </Link>
          ))}
        </nav>
        <Link href="/" className="flex items-center justify-center gap-2 text-blue" onClick={() => setOpen(false)}>
          {logoUrl ? <Image src={logoUrl} alt="" width={42} height={42} className="h-10 w-10 rounded-full object-cover" /> : null}
          <span className="text-center text-sm font-extrabold uppercase leading-[0.9] tracking-wide">
            {first}
            <br />
            {second ?? ""}
          </span>
        </Link>
        <div className="flex items-center justify-end gap-2">
          <a href={phoneHref} className="hidden rounded-full border border-ink px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] md:inline-block">
            {labels.call}
          </a>
          <a href={whatsappHref} className="rounded-full bg-blue px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-paper">
            {labels.order}
          </a>
          <button type="button" className="text-[11px] font-extrabold uppercase tracking-widest md:hidden" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? "Zatvori" : "Meni"}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="flex flex-col gap-3 border-t border-ink/10 px-4 py-4 md:hidden" aria-label="Mobilna navigacija">
          {linkHrefs.map((link) => (
            <Link key={link.href} href={link.href} className="text-2xl font-extrabold uppercase" onClick={() => setOpen(false)}>
              {labels[link.key]}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
