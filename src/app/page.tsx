import Image from "next/image";
import Link from "next/link";
import { HeroStage } from "@/components/hero-stage";
import { formatKm } from "@/lib/format";
import { getSite } from "@/lib/contentful";

export const revalidate = 60;

function whatsappHref(phoneHref: string, message: string) {
  const digits = phoneHref.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default async function HomePage() {
  const { settings, burgers, combos, promotions, burgerParts, hours } = await getSite();
  const orderHref = whatsappHref(settings.phoneHref, settings.whatsappMessage);

  return (
    <main>
      <HeroStage
        title={settings.heroTitle}
        slogan={settings.slogan}
        tagline={settings.tagline}
        imageUrl={settings.heroImage?.url ?? null}
        imageAlt={settings.heroImage?.alt ?? ""}
        orderHref={orderHref}
        orderLabel={settings.orderButton}
      />

      {burgerParts.length > 0 ? (
        <section className="relative overflow-hidden px-4 py-20">
          <p aria-hidden="true" className="pointer-events-none select-none text-center text-[13vw] font-extrabold uppercase leading-[0.78] text-red">
            {settings.slogan}
            <br />
            {settings.slogan}
          </p>
          <div className="pointer-events-none absolute inset-x-0 top-8 bottom-8 flex flex-col items-center justify-center">
            {burgerParts.map((part, index) => (
              <Image
                key={part.name}
                src={part.image.url}
                alt={part.name}
                width={part.image.width}
                height={part.image.height}
                className="w-[min(42vw,15rem)] object-contain mix-blend-multiply"
                style={{ marginTop: index === 0 ? 0 : "-6%", transform: `rotate(${(index % 2 === 0 ? -4 : 5)}deg)` }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {promotions.length > 0 || combos.length > 0 ? (
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-3">
        {promotions.map((promo, index) => (
          <article key={promo.title} className={`overflow-hidden rounded-3xl p-5 ${index === 1 ? "bg-red text-paper" : "bg-[#f0b429] text-ink"}`}>
            {promo.image ? (
              <Image src={promo.image.url} alt={promo.image.alt} width={promo.image.width} height={promo.image.height} className="mb-4 aspect-[4/3] w-full rounded-2xl object-cover" />
            ) : null}
            <p className="text-xs font-extrabold uppercase tracking-[0.16em]">{promo.schedule}</p>
            <h2 className="mt-2 text-3xl font-extrabold uppercase leading-none">{promo.title}</h2>
            <p className="mt-3 text-sm leading-relaxed">{promo.description}</p>
            <p className="mt-4 text-2xl font-extrabold">{formatKm(promo.price)}</p>
          </article>
        ))}
        {combos[0] ? (
          <article className="rounded-3xl bg-ink p-5 text-paper md:col-span-3 md:flex md:items-end md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f0b429]">{combos[0].name}</p>
              <h2 className="mt-2 text-4xl font-extrabold uppercase leading-none">{combos[0].includes.join(" + ")}</h2>
              <p className="mt-3 max-w-xl text-sm">{combos[0].description}</p>
            </div>
            <p className="mt-4 text-5xl font-extrabold text-[#f0b429]">{formatKm(combos[0].price)}</p>
          </article>
        ) : null}
      </section>
      ) : null}

      <section id="o-nama" className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-sm font-extrabold uppercase leading-relaxed tracking-wide md:text-base">{settings.about}</p>
        <Link href="/lokacija" className="mt-6 inline-block text-sm font-extrabold lowercase text-blue underline">
          {settings.learnMore}
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-4xl font-extrabold uppercase tracking-tight text-blue md:text-5xl">{settings.burgersHeading}</h2>
          <Link href="/meni" className="text-sm font-extrabold lowercase text-blue underline">
            {settings.menuLink}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {burgers.map((burger) => (
            <article key={burger.slug}>
              {burger.image ? (
                <Image src={burger.image.url} alt={burger.image.alt} width={burger.image.width} height={burger.image.height} className="aspect-square w-full rounded-3xl object-cover" />
              ) : null}
              <h3 className="mt-4 text-2xl font-extrabold uppercase text-blue">{burger.name}</h3>
              <p className="mt-2 text-sm leading-relaxed">
                <span className="font-extrabold">{settings.ingredientsLabel}: </span>
                {burger.ingredients.join(", ")}
              </p>
              <p className="mt-3 text-sm font-extrabold uppercase tracking-wide">{formatKm(burger.price)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl text-4xl font-extrabold uppercase leading-none text-blue md:text-5xl">{settings.instagramHeading}</h2>
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
            {settings.orderButton}
          </a>
        </article>
        <article className="flex flex-col justify-between rounded-[2rem] bg-red p-8 text-paper">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em]">Za ponijeti</p>
            <h2 className="mt-3 text-4xl font-extrabold uppercase leading-none">{settings.whatsappTitle}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed">{settings.whatsappBody}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={orderHref} className="rounded-full bg-paper px-5 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-red">
              {settings.whatsappButton}
            </a>
            <a href={settings.phoneHref} className="rounded-full border border-paper px-5 py-3 text-xs font-extrabold uppercase tracking-[0.16em]">
              {settings.callLabel} {settings.phoneDisplay}
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
