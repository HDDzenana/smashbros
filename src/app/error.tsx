"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="font-display text-5xl uppercase">Meni se nije učitao</h1>
      <p className="mt-4 text-lg">Sadržaj iz Contentfula trenutno nije dostupan.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-full bg-red px-5 py-3 font-bold uppercase text-cream">
        Pokušaj ponovo
      </button>
    </main>
  );
}
