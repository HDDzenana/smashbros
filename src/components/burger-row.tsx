"use client";

import Image from "next/image";
import { useState } from "react";
import { formatKm } from "@/lib/format";

type BurgerCard = {
  name: string;
  ingredients: string[];
  price: number;
  image: { url: string; alt: string; width: number; height: number } | null;
};

export function BurgerRow({
  burgers,
  ingredientsLabel,
  previousLabel,
  nextLabel,
}: {
  burgers: BurgerCard[];
  ingredientsLabel: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const [start, setStart] = useState(0);
  if (burgers.length === 0) return null;
  const count = burgers.length;
  const visible = [0, 1, 2].map((offset) => burgers[(start + offset) % count]);

  return (
    <div>
      <div className="relative">
        <button
          type="button"
          aria-label={previousLabel}
          className="absolute left-0 top-28 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-red bg-paper text-lg text-red md:grid"
          onClick={() => setStart((value) => (value - 1 + count) % count)}
        >
          ‹
        </button>
        <div className="grid items-start gap-6 md:grid-cols-3 md:px-14">
          {visible.map((burger, index) => (
            <article key={`${burger.name}-${index}`} className={index === 1 ? "text-center" : "hidden text-center md:block"}>
              {burger.image ? (
                <Image
                  src={burger.image.url}
                  alt={burger.image.alt || burger.name}
                  width={burger.image.width}
                  height={burger.image.height}
                  className={`mx-auto object-contain ${index === 1 ? "w-[min(100%,22rem)]" : "w-[min(100%,14rem)]"}`}
                />
              ) : null}
              <h3 className="mt-4 text-xl font-extrabold uppercase">{burger.name}</h3>
              <p className="mx-auto mt-2 max-w-xs text-xs uppercase leading-relaxed">
                <span className="font-extrabold">{ingredientsLabel}: </span>
                {burger.ingredients.join(", ")}
              </p>
              <p className="mt-3 text-sm font-extrabold uppercase text-red">{formatKm(burger.price)}</p>
            </article>
          ))}
        </div>
        <button
          type="button"
          aria-label={nextLabel}
          className="absolute right-0 top-28 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-red bg-paper text-lg text-red md:grid"
          onClick={() => setStart((value) => (value + 1) % count)}
        >
          ›
        </button>
      </div>
      <div className="mt-4 flex justify-center gap-3 md:hidden">
        <button type="button" aria-label={previousLabel} className="h-10 w-10 rounded-full border border-red text-lg text-red" onClick={() => setStart((value) => (value - 1 + count) % count)}>
          ‹
        </button>
        <button type="button" aria-label={nextLabel} className="h-10 w-10 rounded-full border border-red text-lg text-red" onClick={() => setStart((value) => (value + 1) % count)}>
          ›
        </button>
      </div>
    </div>
  );
}
