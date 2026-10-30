import type { Metadata } from "next";
import { getSite } from "@/lib/contentful";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite();
  return { title: settings.locationTitle };
}

export default async function LocationPage() {
  const { settings, hours } = await getSite();

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
      <section>
        {settings.locationKicker ? <p className="text-sm font-bold uppercase tracking-[0.25em] text-red">{settings.locationKicker}</p> : null}
        <h1 className="mt-2 text-6xl font-extrabold uppercase tracking-tight">{settings.locationTitle}</h1>
        <p className="mt-6 font-display text-4xl uppercase leading-none">
          {settings.address}
          <br />
          {settings.city}
        </p>
        <p className="mt-4 max-w-md text-lg">{settings.hoursNote}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={settings.phoneHref} className="rounded-full bg-red px-5 py-3 font-bold uppercase text-cream">
            {settings.phoneDisplay}
          </a>
          {settings.mapsUrl && settings.mapsLabel ? (
            <a href={settings.mapsUrl} className="rounded-full border-2 border-ink px-5 py-3 font-bold uppercase" target="_blank" rel="noreferrer">
              {settings.mapsLabel}
            </a>
          ) : null}
          <a href={settings.instagramUrl} className="rounded-full border-2 border-ink px-5 py-3 font-bold uppercase" target="_blank" rel="noreferrer">
            {settings.instagram}
          </a>
        </div>
      </section>
      <section className="rounded-[1.6rem] border border-ink/10 bg-paper p-6">
        <h2 className="font-display text-3xl uppercase">{settings.hoursHeading}</h2>
        <ul className="mt-4">
          {hours.map((row) => (
            <li key={row.day} className="flex items-baseline justify-between border-b border-ink/15 py-3">
              <span className="font-bold">{row.day}</span>
              <span className={row.closed ? "font-bold uppercase text-red" : ""}>{row.hours}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
