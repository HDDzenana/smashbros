import Image from "next/image";
import Link from "next/link";
import { BurgerRow } from "@/components/burger-row";
import { HeroStage } from "@/components/hero-stage";
import { formatKm } from "@/lib/format";
import { getSite } from "@/lib/contentful";

export const revalidate = 60;

function whatsappHref(phoneHref: string, message: string) {
  const digits = phoneHref.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default async function HomePage() {
  const { settings, burgers, combos, promotions, hours, sections } = await getSite();
  const orderHref = whatsappHref(settings.phoneHref, settings.whatsappMessage);
  const keys = (sections.length > 0 ? sections.map((section) => section.key) : ["about", "promotions", "burgers", "instagram", "visit"]);

  const blocks = keys.flatMap((key) => {
    if (key === "promotions" && (promotions.length > 0 || combos.length > 0)) {
      return [
      <section key="promotions" className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-3">
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
      </section>,
      ];
    }
    if (key === "about" && settings.about) {
      return [
        <section id="o-nama" key="about" data-flush="1" className="bg-red text-paper">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:flex-row md:items-end md:justify-between">
            <h2 className="text-5xl font-extrabold uppercase leading-[0.85] text-paper md:text-7xl">
              {settings.aboutKicker}
              <br />
              {settings.aboutHeading}
            </h2>
            <div className="max-w-md">
              <p className="text-xs font-extrabold uppercase leading-relaxed">{settings.about}</p>
              <Link href="/lokacija" className="mt-5 inline-block rounded-full bg-paper px-5 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-red">
                {settings.learnMore}
              </Link>
            </div>
          </div>
          {settings.gallery.length > 0 ? (
            <div className="flex items-end justify-center gap-4 overflow-hidden px-4 pb-12">
              {settings.gallery.map((photo, index) => (
                <Image
                  key={photo.url}
                  src={photo.url}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className={`aspect-square shrink-0 object-cover ${index % 2 === 0 ? "w-[min(28vw,16rem)] rounded-full" : "w-[min(34vw,22rem)]"}`}
                />
              ))}
            </div>
          ) : null}
        </section>,
      ];
    }
    if (key === "burgers" && burgers.length > 0) {
      return [
        <section key="burgers" className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="text-center text-3xl font-extrabold uppercase tracking-tight text-red md:text-5xl">{settings.burgersHeading}</h2>
          <div className="mt-10">
            <BurgerRow burgers={burgers} ingredientsLabel={settings.ingredientsLabel} previousLabel={settings.previousLabel} nextLabel={settings.nextLabel} />
          </div>
          <div className="mt-10 text-center">
            <Link href="/meni" className="inline-block rounded-full bg-red px-6 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-paper">
              {settings.menuLink}
            </Link>
          </div>
        </section>,
      ];
    }
    if (key === "instagram" && settings.gallery.length > 0) {
      return [
      <section key="instagram" className="mx-auto max-w-6xl px-4 pb-16">
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
      </section>,
      ];
    }
    if (key === "visit") {
      return [
      <section key="visit" className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-2">
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
            {settings.takeawayKicker ? <p className="text-xs font-extrabold uppercase tracking-[0.16em]">{settings.takeawayKicker}</p> : null}
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
      </section>,
      ];
    }
    return [];
  });

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
      {blocks.map((block, index) => (
        <div key={index} className={index === 0 ? "pt-0" : "pt-16"}>
          {block}
        </div>
      ))}
    </main>
  );
}
