export function GiantMarquee({ text, outline = false, reverse = false }: { text: string; outline?: boolean; reverse?: boolean }) {
  const line = `${text}   `;
  const repeated = line.repeat(8);
  return (
    <div className="overflow-hidden bg-paper py-2 text-blue">
      <div className={`marquee flex whitespace-nowrap text-[16vw] font-extrabold uppercase leading-[0.8] ${reverse ? "marquee-reverse" : ""} ${outline ? "text-transparent [-webkit-text-stroke:2px_#e10600]" : ""}`}>
        <span>{repeated}</span>
        <span aria-hidden="true">{repeated}</span>
      </div>
    </div>
  );
}
