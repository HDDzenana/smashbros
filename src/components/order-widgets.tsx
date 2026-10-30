"use client";

import { useEffect, useState } from "react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l6-1.1A11 11 0 0 0 20.5 3.5ZM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.5.7.7-3.4-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 12 12 0 0 0 4.5 4 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

export function OrderWidgets({
  whatsappHref,
  kicker,
  title,
  body,
  button,
  later,
  cookieTitle,
  cookieBody,
  cookieAccept,
  fabLabel,
  showOrderPopup,
  closeLabel,
}: {
  whatsappHref: string;
  kicker: string;
  title: string;
  body: string;
  button: string;
  later: string;
  cookieTitle: string;
  cookieBody: string;
  cookieAccept: string;
  fabLabel: string;
  showOrderPopup: boolean;
  closeLabel: string;
}) {
  const [cookies, setCookies] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setCookies(localStorage.getItem("sb-cookies") !== "1");
    setModal(showOrderPopup && sessionStorage.getItem("sb-wa") !== "1");
  }, [showOrderPopup]);

  function acceptCookies() {
    localStorage.setItem("sb-cookies", "1");
    setCookies(false);
  }

  function closeModal() {
    sessionStorage.setItem("sb-wa", "1");
    setModal(false);
  }

  return (
    <>
      {showOrderPopup && modal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-sm bg-paper shadow-2xl">
            <button type="button" onClick={closeModal} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper text-xl" aria-label={closeLabel}>
              ×
            </button>
            <div className="bg-blue px-6 py-10 text-center text-paper">
              <p className="text-3xl font-extrabold uppercase leading-none tracking-tight">{kicker}</p>
              <p className="mt-2 text-3xl font-extrabold uppercase leading-none tracking-tight">{title}</p>
            </div>
            <div className="px-6 py-6 text-center">
              <p className="text-sm leading-relaxed">
                {body}
              </p>
              <a href={whatsappHref} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white">
                <WhatsAppIcon className="h-5 w-5" />
                {button}
              </a>
              <button type="button" onClick={closeModal} className="mt-4 block w-full text-sm font-extrabold uppercase tracking-widest">
                {later}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {cookies ? (
        <aside className="fixed bottom-4 left-4 z-40 w-[min(100%-2rem,22rem)] border border-ink bg-paper p-4 shadow-lg">
          <p className="text-sm font-extrabold uppercase">{cookieTitle}</p>
          <p className="mt-2 text-xs uppercase leading-relaxed">{cookieBody}</p>
          <button type="button" onClick={acceptCookies} className="mt-4 rounded-full bg-blue px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-paper">
            {cookieAccept}
          </button>
        </aside>
      ) : null}

      <a href={whatsappHref} className="fixed bottom-4 right-4 z-40 grid h-24 w-24 place-items-center" aria-label={button}>
        <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 text-blue" aria-hidden="true">
          <defs>
            <path id="wa-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
          </defs>
          <text fontSize="11" fontWeight="800" fill="currentColor">
            <textPath href="#wa-circle">{`${fabLabel} · ${fabLabel} · `}</textPath>
          </text>
        </svg>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white">
          <WhatsAppIcon className="h-7 w-7" />
        </span>
      </a>
    </>
  );
}
