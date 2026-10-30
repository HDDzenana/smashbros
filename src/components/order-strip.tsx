export function OrderStrip({ words, pill, href }: { words: string; pill: string; href: string }) {
  if (!words) return null;
  const chunk = (
    <span className="inline-flex items-center gap-6 pr-6">
      <span>{words}</span>
      <a href={href} className="rounded-full bg-paper px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-red">
        {pill}
      </a>
    </span>
  );
  return (
    <div className="overflow-hidden bg-red py-4 text-paper">
      <div className="marquee flex w-max whitespace-nowrap text-[12vw] font-extrabold uppercase leading-none md:text-7xl">
        <span className="inline-flex">
          {chunk}
          {chunk}
          {chunk}
          {chunk}
        </span>
        <span className="inline-flex" aria-hidden="true">
          {chunk}
          {chunk}
          {chunk}
          {chunk}
        </span>
      </div>
    </div>
  );
}
