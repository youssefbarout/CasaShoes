import { useState } from "react";

const ADMIN_CREDENTIALS = { username: "admin", password: "casashoes2026" };

export default function LoginModal({ onSuccess, onClose }) {
  const [tab, setTab] = useState("user");
  const [userPrenom, setUserPrenom] = useState("");
  const [userNom, setUserNom] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUserLogin = (e) => {
    e.preventDefault();
    if (!userPrenom.trim() || !userNom.trim()) { setError("Veuillez entrer votre prénom et nom."); return; }
    setLoading(true);
    setTimeout(() => {
      onSuccess("user", `${userPrenom.trim()} ${userNom.trim()}`);
    }, 400);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (
        username.trim() === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        onSuccess("admin", "Administrateur");
      } else {
        setError("Identifiant ou mot de passe incorrect.");
        setLoading(false);
      }
    }, 600);
  };

  const switchTab = (t) => {
    setTab(t);
    setError("");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-[#0f0f1e] border border-violet-500/25 rounded-3xl shadow-[0_25px_80px_rgba(124,58,237,0.25)] overflow-hidden"
        style={{ animation: "fadeIn 0.2s ease" }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 cursor-pointer flex items-center justify-center transition-all"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">&#x1F45F;</span>
          </div>
          <h2 className="text-white font-extrabold text-xl mb-1">Connexion CasaShoes</h2>
          <p className="text-white/40 text-sm">Choisissez votre type de compte</p>
        </div>

        {/* Tabs */}
        <div className="px-8 pb-5">
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
            <button
              onClick={() => switchTab("user")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all ${
                tab === "user"
                  ? "bg-cyan-600 text-white shadow-[0_2px_12px_rgba(8,145,178,0.4)]"
                  : "bg-transparent text-white/45 hover:text-white/70"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Utilisateur
            </button>
            <button
              onClick={() => switchTab("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all ${
                tab === "admin"
                  ? "bg-violet-600 text-white shadow-[0_2px_12px_rgba(124,58,237,0.4)]"
                  : "bg-transparent text-white/45 hover:text-white/70"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93C9.33 17.79 7 14.5 7 11V7.18L12 5z" />
              </svg>
              Administrateur
            </button>
          </div>
        </div>

        {/* ── TAB UTILISATEUR ── */}
        {tab === "user" && (
          <form onSubmit={handleUserLogin} className="px-8 pb-8 flex flex-col gap-4">
            <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-2xl px-4 py-3 flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <p className="text-cyan-300/80 text-xs leading-relaxed">
                Acc&egrave;s visiteur — parcourez les produits et ajoutez au panier librement.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Prénom</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={userPrenom}
                    onChange={(e) => { setUserPrenom(e.target.value); setError(""); }}
                    placeholder="Ahmed"
                    autoComplete="given-name"
                    required
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl text-sm outline-none placeholder-white/25 focus:border-cyan-500/60 focus:bg-cyan-500/5 transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Nom</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={userNom}
                    onChange={(e) => { setUserNom(e.target.value); setError(""); }}
                    placeholder="Barout"
                    autoComplete="family-name"
                    required
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl text-sm outline-none placeholder-white/25 focus:border-cyan-500/60 focus:bg-cyan-500/5 transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/12 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer border-none bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-500 hover:to-teal-500 hover:shadow-[0_4px_20px_rgba(8,145,178,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                  </svg>
                  Entrer comme visiteur
                </>
              )}
            </button>
          </form>
        )}

        {/* ── TAB ADMINISTRATEUR ── */}
        {tab === "admin" && (
          <form onSubmit={handleAdminLogin} className="px-8 pb-8 flex flex-col gap-4">
            <div className="bg-violet-500/8 border border-violet-500/20 rounded-2xl px-4 py-3 flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93C9.33 17.79 7 14.5 7 11V7.18L12 5z" />
              </svg>
              <p className="text-violet-300/80 text-xs leading-relaxed">
                Acc&egrave;s r&eacute;serv&eacute; — tableau de bord, gestion des produits et commandes.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Identifiant</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="admin"
                  autoComplete="username"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Mot de passe</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-12 py-3 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 cursor-pointer bg-transparent border-none transition-colors p-1"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/12 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer border-none bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_4px_20px_rgba(124,58,237,0.5)] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  V&eacute;rification...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                  Acc&eacute;der au tableau de bord
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
