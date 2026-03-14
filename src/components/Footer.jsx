import { useState } from "react";
import { useInView } from "../hooks/useInView";

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    color: "hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:via-[#dc2743] hover:via-[#cc2366] hover:to-[#bc1888] hover:border-[#bc1888]",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com",
    color: "hover:bg-black hover:border-white/20",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com",
    color: "hover:bg-black hover:border-white/30",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/212600000000",
    color: "hover:bg-[#25d366] hover:border-[#25d366]",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

const navLinks = [
  { label: "Accueil", href: "#accueil", path: "/accueil" },
  { label: "Produits", href: "#produits", path: "/produits" },
  { label: "Catégories", href: "#categories", path: "/categories" },
  { label: "Contact", href: "#contact", path: "/contact" },
];

const categories = [
  { label: "Homme" },
  { label: "Femme" },
  { label: "Enfant" },
  { label: "Sport" },
];

const infos = [
  {
    text: "123 Rue Mohammed V, Casablanca",
    href: "https://maps.google.com/?q=Casablanca",
    color: "bg-rose-500/15 text-rose-400",
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>,
  },
  {
    text: "+212 6 00 00 00 00",
    href: "tel:+212600000000",
    color: "bg-emerald-500/15 text-emerald-400",
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>,
  },
  {
    text: "contact@casashoes.ma",
    href: "mailto:contact@casashoes.ma",
    color: "bg-violet-500/15 text-violet-400",
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
  },
  {
    text: "Lun–Sam : 9h – 20h",
    href: null,
    color: "bg-amber-500/15 text-amber-400",
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>,
  },
];

export default function Footer({ onCategorySelect, onNavigateSection }) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [topRef, topVisible] = useInView(0.08);
  const [midRef, midVisible] = useInView(0.1);
  const [botRef, botVisible] = useInView(0.2);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer id="contact" className="relative bg-[#070707] overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

      {/* Background blobs */}
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-violet-600/5 blur-[80px] pointer-events-none" />

      {/* Newsletter banner */}
      <div
        ref={midRef}
        className={`relative border-b border-white/6 reveal ${midVisible ? "visible" : ""}`}
      >
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="relative rounded-3xl bg-gradient-to-br from-violet-600/12 via-violet-500/6 to-transparent border border-violet-500/20 px-8 py-10 flex flex-col lg:flex-row items-center gap-8 overflow-hidden">
            {/* Decorative ring */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-violet-500/10 pointer-events-none" />
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-violet-500/15 pointer-events-none" />

            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block bg-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Newsletter exclusive</span>
              <h3 className="text-2xl font-extrabold text-white mb-2">
                Restez à la <span className="text-violet-400">mode</span> 👟
              </h3>
              <p className="text-white/50 text-sm max-w-md">
                Recevez en avant-première nos nouvelles collections, offres exclusives et codes promo.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-2xl font-semibold text-sm flex-shrink-0">
                <span className="text-2xl">✅</span> Merci ! Vous êtes abonné(e).
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/8 border border-white/15 text-white px-5 py-3 rounded-xl text-sm outline-none w-full sm:w-64 placeholder-white/35 focus:border-violet-400 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-none px-6 py-3 rounded-xl text-sm font-bold cursor-pointer hover:from-violet-500 hover:to-purple-500 hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(124,58,237,0.4)] whitespace-nowrap"
                >
                  S'abonner →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div
        ref={topRef}
        className="max-w-6xl mx-auto px-6 py-14"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className={`sm:col-span-2 lg:col-span-1 reveal from-left ${topVisible ? "visible" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl">👟</span>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Casa<span className="text-violet-400">Shoes</span>
              </span>
            </div>
            <p className="text-white/45 text-sm leading-loose mb-6">
              Votre destination mode pour des chaussures de qualité. Style, confort et originalité au meilleur prix depuis 2015.
            </p>
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  title={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white no-underline hover:-translate-y-1 transition-all duration-200 ${s.color}`}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className={`reveal ${topVisible ? "visible" : ""}`} style={{ transitionDelay: "0.12s" }}>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-violet-500 inline-block rounded" />
              Navigation
            </h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigateSection) onNavigateSection(l.path);
                    }}
                    className="text-white/50 text-sm no-underline hover:text-violet-400 hover:pl-1.5 transition-all flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-violet-400/0 group-hover:bg-violet-400 transition-colors flex-shrink-0" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories */}
          <div className={`reveal ${topVisible ? "visible" : ""}`} style={{ transitionDelay: "0.22s" }}>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-violet-500 inline-block rounded" />
              Catégories
            </h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {categories.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => {
                      onCategorySelect?.(l.label);
                      if (onNavigateSection) onNavigateSection("/produits");
                    }}
                    className="text-white/50 text-sm no-underline bg-transparent border-none p-0 cursor-pointer hover:text-violet-400 hover:pl-1.5 transition-all flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-violet-400/0 group-hover:bg-violet-400 transition-colors flex-shrink-0" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={`reveal from-right ${topVisible ? "visible" : ""}`} style={{ transitionDelay: "0.32s" }}>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-violet-500 inline-block rounded" />
              Contact
            </h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              {infos.map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    {item.svg}
                  </span>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                      className="text-white/50 text-sm leading-snug no-underline hover:text-violet-400 transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-white/50 text-sm leading-snug">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        ref={botRef}
        className={`border-t border-white/6 reveal ${botVisible ? "visible" : ""}`}
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs m-0 text-center sm:text-left">
            © 2026 <span className="text-violet-400/70 font-semibold">CasaShoes</span> — Tous droits réservés. Fait avec ❤️ à Casablanca.
          </p>
          <div className="flex items-center gap-4">
            {["Confidentialité", "CGV", "Mentions légales"].map((t) => (
              <a key={t} href="#" className="text-white/25 text-xs no-underline hover:text-violet-400 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

