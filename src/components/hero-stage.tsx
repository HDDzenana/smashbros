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
  orderLabel: string;
};

function Track({ text, reverse = false, outline = false }: { text: string; reverse?: boolean; outline?: boolean }) {
  const line = `${text}     `.repeat(8);
  return (
    <p
      className={`marquee w-max whitespace-nowrap text-[11vw] font-extrabold uppercase leading-[0.9] md:text-[7.2vw] ${reverse ? "marquee-reverse" : ""} ${outline ? "text-transparent" : "text-red"}`}
      style={{ WebkitTextStroke: outline ? "1.5px #e10600" : undefined }}
    >
      <span>{line}</span>
      <span>{line}</span>
    </p>
  );
}

export function HeroStage({ title, slogan, tagline, imageUrl, imageAlt, orderHref, orderLabel }: HeroStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

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

  const radius = 22 + progress * 125;

  return (
    <section ref={sectionRef} className="relative h-[230vh] bg-paper">
      <div className="sticky top-[4.5rem] h-[calc(100svh-4.5rem)] overflow-hidden bg-paper">
        <div
          className="absolute left-1/2 top-1/2 w-[160%] -translate-x-1/2 -translate-y-1/2 -rotate-12"
          style={{ opacity: 1 - progress }}
        >
          <Track text={slogan} />
          <Track text={tagline} reverse outline />
          <Track text={slogan} />
          <Track text={tagline} reverse outline />
        </div>

        <div className="absolute inset-0" style={{ clipPath: `circle(${radius}% at 50% 42%)` }}>
          {imageUrl ? <Image src={imageUrl} alt={imageAlt} fill priority className="object-cover" /> : null}
          <h1
            className="absolute left-1/2 top-[16%] w-[min(90%,40rem)] -translate-x-1/2 text-center text-3xl font-extrabold uppercase leading-[0.95] text-red md:text-5xl"
            style={{ opacity: progress }}
          >
            {title}
          </h1>
          <a
            href={orderHref}
            className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-full bg-red px-6 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-paper"
            style={{ opacity: progress > 0.72 ? 1 : 0, pointerEvents: progress > 0.72 ? "auto" : "none" }}
          >
            {orderLabel}
          </a>
        </div>

        <a
          href={orderHref}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-red px-6 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-paper"
          style={{ opacity: progress < 0.4 ? 1 : 0, pointerEvents: progress < 0.4 ? "auto" : "none" }}
        >
          {orderLabel}
        </a>
      </div>
    </section>
  );
}
