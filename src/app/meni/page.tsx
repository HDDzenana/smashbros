import type { Metadata } from "next";
import Image from "next/image";
import { formatKm } from "@/lib/format";
import { getSite } from "@/lib/contentful";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite();
  return { title: settings.menuTitle };
}

export default async function MenuPage() {
  const { settings, burgers, extras, drinks, combos } = await getSite();
  const groups = [
    { id: "Prilog", label: settings.sidesHeading },
    { id: "Dodatak", label: settings.addonsHeading },
    { id: "Sos", label: settings.saucesHeading },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {settings.menuKicker ? <p className="text-sm font-bold uppercase tracking-[0.25em] text-red">{settings.menuKicker}</p> : null}
      <h1 className="mt-2 text-6xl font-extrabold uppercase tracking-tight">{settings.menuTitle}</h1>

      <section className="mt-10 space-y-8">
        {burgers.map((burger) => (
          <article key={burger.slug} className="grid gap-5 border-b border-ink/15 pb-8 md:grid-cols-[220px_1fr]">
            {burger.image ? (
              <Image
                src={burger.image.url}
                alt={burger.image.alt}
                width={burger.image.width}
                height={burger.image.height}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            ) : null}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-4xl font-extrabold uppercase tracking-tight">{burger.name}</h2>
                <p className="text-3xl font-extrabold text-red">{formatKm(burger.price)}</p>
              </div>
              <p className="mt-2 text-lg">{burger.description}</p>
              <p className="mt-3 text-sm uppercase tracking-wide text-ink/70">{burger.ingredients.join(" · ")}</p>
            </div>
          </article>
        ))}
      </section>

      {combos.map((combo) => (
        <section key={combo.name} className="mt-12 rounded-[1.6rem] border border-ink/10 bg-[#f3d27a] p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-4xl uppercase">{combo.name}</h2>
            <p className="font-display text-4xl text-red">{formatKm(combo.price)}</p>
          </div>
          <p className="mt-3">{combo.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {combo.includes.map((item) => (
              <li key={item} className="rounded-full border-2 border-ink px-3 py-1 text-sm font-bold uppercase">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mt-12 grid gap-8 md:grid-cols-3">
        {groups.filter((group) => extras.some((item) => item.group === group.id)).map((group) => (
          <div key={group.id}>
            <h2 className="font-display text-3xl uppercase">{group.label}</h2>
            <ul className="mt-4 space-y-3">
              {extras
                .filter((item) => item.group === group.id)
                .map((item) => (
                  <li key={`${item.name}-${item.detail}`} className="border-b border-ink/20 pb-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-bold">
                        {item.name}
                        {item.detail ? <span className="font-normal text-ink/70"> · {item.detail}</span> : null}
                      </span>
                      <span className="font-display text-xl text-red">{formatKm(item.price)}</span>
                    </div>
                    {item.note ? <p className="mt-1 text-sm">{item.note}</p> : null}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>

      {drinks.length > 0 ? (
      <section className="mt-12">
        <h2 className="font-display text-3xl uppercase">{settings.drinksHeading}</h2>
        <ul className="mt-4 divide-y divide-ink/20 border-y border-ink/20">
          {drinks.map((drink) => (
            <li key={drink.name} className="flex items-baseline justify-between py-3">
              <span className="font-bold uppercase">{drink.name}</span>
              <span className="font-display text-2xl text-red">{formatKm(drink.price)}</span>
            </li>
          ))}
        </ul>
      </section>
      ) : null}
    </main>
  );
}
