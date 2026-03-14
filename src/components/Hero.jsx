import { useEffect, useState } from "react";

export default function Hero({ onShopNow }) {
  const [visible, setVisible] = useState(false);

  // Trigger hero animations shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const rv = (extra = "") =>
    `reveal${extra ? " " + extra : ""} ${visible ? "visible" : ""}`;

  return (
    <section id="accueil" className="relative min-h-screen bg-[#0a0a14] flex items-center overflow-hidden pt-17">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob-animate absolute w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[90px] -top-24 -right-12" />
        <div className="blob-animate-2 absolute w-[350px] h-[350px] rounded-full bg-cyan-500/15 blur-[80px] -bottom-20 left-[10%]" />
        <div className="blob-animate-3 absolute w-[280px] h-[280px] rounded-full bg-pink-500/12 blur-[80px] top-[40%] left-[40%]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text — staggered entrance */}
        <div>
          <span className={`inline-block bg-violet-500/15 border border-violet-400/40 text-violet-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 ${rv("from-left hero-line-1")}`}>
            ✦ Nouvelle Collection 2026
          </span>
          <h1 className={`text-5xl lg:text-6xl font-black text-white leading-tight mb-5 ${rv("from-left hero-line-2")}`}>
            Trouvez la chaussure<br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">parfaite</span> pour vous
          </h1>
          <p className={`text-white/55 text-lg leading-relaxed mb-8 ${rv("from-left hero-line-3")}`}>
            Des centaines de modèles des meilleures marques mondiales.<br />
            Qualité, style et confort réunis chez CasaShoes.
          </p>
          <div className={`flex flex-wrap gap-4 mb-10 ${rv("from-left hero-line-4")}`}>
            <button
              onClick={onShopNow}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-none px-8 py-3.5 rounded-full text-base font-bold cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(124,58,237,0.55)] transition-all shadow-[0_4px_20px_rgba(124,58,237,0.35)]"
            >
              Découvrir la collection →
            </button>
            <a
              href="#produits"
              onClick={(e) => { e.preventDefault(); document.getElementById('produits')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className="bg-transparent text-white border border-white/25 px-8 py-3.5 rounded-full text-base font-semibold cursor-pointer hover:border-violet-400 hover:bg-violet-500/10 hover:text-violet-300 transition-all no-underline flex items-center"
            >
              Nos offres ↓
            </a>
          </div>
          {/* Stats */}
          <div className={`flex items-center gap-6 ${rv("from-left hero-line-5")}`}>
            {[["500+", "Modèles"], ["20+", "Marques"], ["98%", "Satisfaits"]].map(([val, lbl], i) => (
              <div key={lbl} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-10 bg-white/10" />}
                <div className="flex flex-col">
                  <strong className="text-2xl font-extrabold bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">{val}</strong>
                  <span className="text-xs text-white/45">{lbl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image — slides from right */}
        <div className={`relative flex items-center justify-center order-first md:order-last ${rv("from-right hero-img-anim")}`}>
          <div className="absolute w-80 h-80 rounded-full bg-violet-600/20 blur-[70px]" />
          <div className="absolute w-48 h-48 rounded-full bg-cyan-500/15 blur-[50px] translate-x-16" />
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"
            alt="Chaussure vedette"
            className="relative z-10 w-full max-w-md rounded-3xl shadow-[0_30px_80px_rgba(124,58,237,0.3)] hover:scale-[1.02] hover:-rotate-1 transition-transform duration-500"
          />
          <div className="absolute top-[15%] -left-2 z-20 bg-violet-500/15 backdrop-blur-md border border-violet-400/25 text-white px-4 py-2 rounded-2xl text-sm font-semibold animate-bounce">
            ⭐ 4.9/5
          </div>
          <div className="absolute bottom-[20%] -right-2 z-20 bg-cyan-500/15 backdrop-blur-md border border-cyan-400/25 text-white px-4 py-2 rounded-2xl text-sm font-semibold animate-[bounce_3s_ease-in-out_1.5s_infinite]">
            🚚 Livraison gratuite
          </div>
        </div>
      </div>
    </section>
  );
}
