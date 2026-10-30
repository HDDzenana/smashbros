const linkHrefs = [
  { href: "/#o-nama", key: "about" },
  { href: "/meni", key: "menu" },
  { href: "/akcije", key: "promotions" },
  { href: "/lokacija", key: "location" },
] as const;

export function SiteFooter({
  siteName,
  address,
  city,
  phoneDisplay,
  phoneHref,
  instagram,
  instagramUrl,
  whatsappHref,
  labels,
  footerLabel,
}: {
  siteName: string;
  address: string;
  city: string;
  phoneDisplay: string;
  phoneHref: string;
  instagram: string;
  instagramUrl: string;
  whatsappHref: string;
  labels: { about: string; menu: string; promotions: string; location: string; order: string };
  footerLabel: string;
}) {
  return (
    <footer className="bg-red text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-start md:justify-between">
        <p className="text-3xl font-extrabold uppercase leading-none">{siteName}</p>
        <nav className="flex flex-col gap-2 text-sm font-extrabold uppercase tracking-[0.14em]" aria-label={footerLabel}>
          {linkHrefs.map((link) => (
            <a key={link.href} href={link.href}>
              {labels[link.key]}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-start gap-4">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={instagram}
            className="grid h-11 w-11 place-items-center rounded-full bg-paper text-red"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href={whatsappHref} className="rounded-full bg-[#25D366] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white">
            {labels.order}
          </a>
          <a href={phoneHref} className="text-sm font-extrabold">
            {phoneDisplay}
          </a>
        </div>
      </div>
      <div className="border-t border-paper/30 px-4 py-4 text-center text-[11px] font-extrabold uppercase tracking-[0.14em]">
        Smash burger Sarajevo · Grbavica burger · naruči burger online · {address}, {city}
      </div>
    </footer>
  );
}
