"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type HeroStageProps = {
  title: string;
  slogan: string;
  tagline: string;
  imageUrl: string | null;
  imageAlt: string;
  orderHref: string;
};

function Track({ text, offset, outline = false }: { text: string; offset: number; outline?: boolean }) {
  const line = `${text}   ·   `.repeat(10);
  return (
    <div className="overflow-hidden">
      <p
        className={`w-max whitespace-nowrap text-[14vw] font-extrabold uppercase leading-[0.85] md:text-[8vw] ${outline ? "text-transparent" : "text-red"}`}
        style={{
          transform: `translate3d(${offset}px, 0, 0)`,
          WebkitTextStroke: outline ? "2px #e10600" : undefined,
        }}
      >
        {line}
      </p>
    </div>
  );
}

export function HeroStage({ title, slogan, tagline, imageUrl, imageAlt, orderHref }: HeroStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(1);
      return;
    }

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const distance = section.offsetHeight - window.innerHeight;
      const traveled = Math.min(Math.max(-section.getBoundingClientRect().top, 0), Math.max(distance, 1));
      setProgress(distance > 0 ? traveled / distance : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const inset = progress * 40;
  const radius = 8 + progress * 36;

  return (
    <section ref={sectionRef} className="relative h-[240vh] bg-paper">
      <div className="sticky top-[4.5rem] h-[calc(100svh-4.5rem)] overflow-hidden">
        <div className="absolute overflow-hidden" style={{ inset, borderRadius: radius }}>
          {imageUrl ? <Image src={imageUrl} alt={imageAlt} fill priority className="object-cover" /> : null}
          <h1 className="absolute left-1/2 top-[16%] w-[min(92%,46rem)] -translate-x-1/2 text-center text-4xl font-extrabold uppercase leading-[0.92] text-red md:text-6xl">
            {title}
          </h1>
          <a
            href={orderHref}
            className="absolute bottom-[42%] left-1/2 z-10 -translate-x-1/2 rounded-full bg-red px-6 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-paper"
          >
            Naruči za ponijeti
          </a>
        </div>
        <p
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/3 hidden origin-left -translate-x-6 -rotate-90 text-6xl font-extrabold uppercase leading-none text-transparent lg:block"
          style={{ WebkitTextStroke: "1.5px #e10600", opacity: progress }}
        >
          {slogan}
        </p>
        <p
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/4 hidden origin-right translate-x-6 rotate-90 text-6xl font-extrabold uppercase leading-none text-red lg:block"
          style={{ opacity: progress }}
        >
          {tagline}
        </p>
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <Track text={slogan} offset={-progress * 520} />
          <Track text={tagline} offset={120 - progress * 640} outline />
          <Track text={slogan} offset={-80 - progress * 420} />
        </div>
      </div>
    </section>
  );
}
