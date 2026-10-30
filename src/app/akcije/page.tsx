import type { Metadata } from "next";
import Image from "next/image";
import { formatKm } from "@/lib/format";
import { getSite } from "@/lib/contentful";

export const metadata: Metadata = { title: "Akcije" };
export const revalidate = 60;

export default async function PromotionsPage() {
  const { promotions } = await getSite();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-red">Sedmica</p>
      <h1 className="mt-2 text-6xl font-extrabold uppercase tracking-tight">Akcije</h1>
      <div className="mt-10 grid gap-8">
        {promotions.map((promo) => (
          <article key={promo.title} className="grid overflow-hidden rounded-[1.6rem] border border-ink/10 bg-paper md:grid-cols-2">
            {promo.image ? (
              <Image
                src={promo.image.url}
                alt={promo.image.alt}
                width={promo.image.width}
                height={promo.image.height}
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="flex flex-col justify-center p-6 md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red">{promo.schedule}</p>
              <h2 className="mt-2 font-display text-5xl uppercase">{promo.title}</h2>
              <p className="mt-3 font-display text-5xl text-red">{formatKm(promo.price)}</p>
              <p className="mt-4 text-lg leading-relaxed">{promo.description}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
