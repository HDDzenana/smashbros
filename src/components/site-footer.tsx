const links = [
  { href: "/#o-nama", label: "O nama" },
  { href: "/meni", label: "Meni" },
  { href: "/akcije", label: "Akcije" },
  { href: "/lokacija", label: "Lokacija" },
];

export function SiteFooter({
  siteName,
  address,
  city,
  phoneDisplay,
  phoneHref,
  instagram,
  instagramUrl,
  whatsappHref,
}: {
  siteName: string;
  address: string;
  city: string;
  phoneDisplay: string;
  phoneHref: string;
  instagram: string;
  instagramUrl: string;
  whatsappHref: string;
}) {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <p className="text-2xl font-extrabold uppercase leading-none tracking-wide text-blue">{siteName}</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-extrabold uppercase tracking-[0.16em]" aria-label="Podnožje">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="text-sm">
          <p>
            {address}, {city}
          </p>
          <a href={phoneHref} className="mt-1 block font-extrabold">
            {phoneDisplay}
          </a>
          <a href={instagramUrl} className="mt-1 block font-extrabold text-blue" target="_blank" rel="noreferrer">
            {instagram}
          </a>
          <a href={whatsappHref} className="mt-1 block font-extrabold text-blue">
            Naruči na WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
