import Image from "next/image";
import Link from "next/link";
import { HeroStage } from "@/components/hero-stage";
import { formatKm } from "@/lib/format";
import { getSite } from "@/lib/contentful";

export const revalidate = 60;

function whatsappHref(phoneHref: string) {
  const digits = phoneHref.replace(/\D/g, "");
  const text = encodeURIComponent("Zdravo Smash Bros, želim naručiti za ponijeti.");
  return `https://wa.me/${digits}?text=${text}`;
}

export default async function HomePage() {
  const { settings, burgers, promotions, hours } = await getSite();
  const orderHref = whatsappHref(settings.phoneHref);

  return (
    <main>
      <HeroStage
        title={settings.heroTitle}
        slogan={settings.slogan}
        tagline={settings.tagline}
        imageUrl={settings.heroImage?.url ?? null}
        imageAlt={settings.heroImage?.alt ?? ""}
        orderHref={orderHref}
      />

      <section id="o-nama" className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-sm font-extrabold uppercase leading-relaxed tracking-wide md:text-base">{settings.about}</p>
        <Link href="/lokacija" className="mt-6 inline-block text-sm font-extrabold lowercase text-blue underline">
          saznaj više
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-4xl font-extrabold uppercase tracking-tight text-blue md:text-5xl">Naši burgeri</h2>
          <Link href="/meni" className="text-sm font-extrabold lowercase text-blue underline">
            cijeli meni
          </Link>
        </div>
        <div className="flex snap-x gap-6 overflow-x-auto pb-4">
          {burgers.map((burger) => (
            <article key={burger.slug} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
              {burger.image ? (
                <Image src={burger.image.url} alt={burger.image.alt} width={burger.image.width} height={burger.image.height} className="aspect-square w-full rounded-3xl object-cover" />
              ) : null}
              <h3 className="mt-4 text-2xl font-extrabold uppercase text-blue">{burger.name}</h3>
              <p className="mt-2 text-sm leading-relaxed">
                <span className="font-extrabold">Sastojci: </span>
                {burger.ingredients.join(", ")}
              </p>
              <p className="mt-3 text-sm font-extrabold uppercase tracking-wide">{formatKm(burger.price)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl text-4xl font-extrabold uppercase leading-none text-blue md:text-5xl">Pridruži se na Instagramu</h2>
          <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="text-sm font-extrabold text-blue underline">
            {settings.instagram}
          </a>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {settings.gallery.map((photo) => (
            <a key={photo.url} href={settings.instagramUrl} target="_blank" rel="noreferrer">
              <Image src={photo.url} alt={photo.alt} width={photo.width} height={photo.height} className="aspect-square w-full rounded-2xl object-cover" />
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-2">
        <article className="rounded-[2rem] bg-cream p-8">
          <h2 className="text-4xl font-extrabold uppercase text-blue">{settings.address}</h2>
          <p className="mt-2 uppercase">{settings.city}</p>
          <a href={settings.phoneHref} className="mt-4 block text-lg font-extrabold text-blue">
            {settings.phoneDisplay}
          </a>
          <p className="mt-4 text-sm">{settings.hoursNote}</p>
          <ul className="mt-4 space-y-1 text-sm uppercase">
            {hours.map((row) => (
              <li key={row.day}>
                {row.day}: {row.hours}
              </li>
            ))}
          </ul>
          <a href={orderHref} className="mt-6 inline-block rounded-full bg-blue px-5 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-paper">
            Naruči za ponijeti
          </a>
        </article>
        <article className="rounded-[2rem] bg-cream p-8">
          <h2 className="text-4xl font-extrabold uppercase text-blue">Akcije</h2>
          <ul className="mt-6 space-y-4">
            {promotions.map((promo) => (
              <li key={promo.title}>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue">{promo.schedule}</p>
                <p className="text-xl font-extrabold uppercase">
                  {promo.title} · {formatKm(promo.price)}
                </p>
              </li>
            ))}
          </ul>
          <Link href="/akcije" className="mt-6 inline-block text-sm font-extrabold text-blue underline">
            sve akcije
          </Link>
        </article>
      </section>
    </main>
  );
}
