import { useState, useEffect, useRef } from "react";
import { products, categories } from "../data/products";

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navH = document.querySelector("nav")?.offsetHeight ?? 68;
  const top = el.getBoundingClientRect().top + window.scrollY - navH - 8;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Navbar({ cartCount, onCartOpen, onSearch, onDashboard, onNavigateSection, userRole, userName, userPrenom, userNom, onLoginOpen, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const query = searchValue.trim().toLowerCase();

  const matchedCategories = query
    ? categories.filter((c) => c !== "Tous" && c.toLowerCase().includes(query))
    : [];

  const matchedProducts = query
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        )
        .slice(0, 5)
    : [];

  const hasSuggestions = matchedCategories.length > 0 || matchedProducts.length > 0;

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchValue);
    setShowSuggestions(false);
    if (onNavigateSection) onNavigateSection("/produits");
    else smoothScrollTo("produits");
  };

  const selectProduct = (name) => {
    setSearchValue(name);
    onSearch(name);
    setShowSuggestions(false);
    if (onNavigateSection) onNavigateSection("/produits");
    else smoothScrollTo("produits");
  };

  const selectCategory = (cat) => {
    setSearchValue(cat);
    onSearch(cat);
    setShowSuggestions(false);
    if (onNavigateSection) onNavigateSection("/produits");
    else smoothScrollTo("produits");
  };

  const navLinks = [
    { href: "#accueil", path: "/accueil", label: "Accueil" },
    { href: "#produits", path: "/produits", label: "Produits" },
    { href: "#categories", path: "/categories", label: "Cat\u00e9gories" },
    { href: "#contact", path: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      scrolled
        ? "bg-[#0a0a14]/98 backdrop-blur-xl border-violet-500/15 shadow-[0_4px_30px_rgba(124,58,237,0.15)]"
        : "bg-[#0a0a14]/95 backdrop-blur-md border-violet-500/8"
    }`}>
      <div className={`max-w-6xl mx-auto px-6 flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "h-14" : "h-17"}`}>

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (onNavigateSection) onNavigateSection("/accueil");
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="text-3xl">&#x1F45F;</span>
          <span className="text-2xl font-extrabold text-white tracking-tight">
            Casa<span className="text-violet-400">Shoes</span>
          </span>
        </div>

        {/* Liens navigation desktop */}
        <ul className="hidden md:flex list-none gap-8 m-0 p-0">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  if (onNavigateSection) onNavigateSection(l.path);
                  else smoothScrollTo(l.href.slice(1));
                }}
                className="text-white/70 no-underline font-medium text-sm hover:text-violet-400 transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 rounded group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Recherche + Panier */}
        <div className="flex items-center gap-3">

          {/* Champ de recherche avec autocomplete */}
          <div ref={searchRef} className="relative">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden focus-within:border-violet-500/60 focus-within:bg-violet-500/5 transition-all"
            >
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  onSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="bg-transparent border-none outline-none text-white px-4 py-2 text-sm w-36 md:w-48 placeholder-white/35"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => { setSearchValue(""); onSearch(""); setShowSuggestions(false); }}
                  className="bg-transparent border-none cursor-pointer px-2 text-white/40 hover:text-white transition-colors text-sm"
                  title="Effacer"
                >&#x2715;</button>
              )}
              <button type="submit" className="bg-transparent border-none cursor-pointer px-3 text-base" title="Rechercher">&#x1F50D;</button>
            </form>

            {/* Menu de suggestions */}
            {showSuggestions && hasSuggestions && (
              <div className="absolute top-full mt-2 left-0 right-0 min-w-[280px] bg-[#13132a] border border-violet-500/25 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50">

                {matchedCategories.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-violet-400/70">
                      Cat&eacute;gories
                    </div>
                    {matchedCategories.map((cat) => (
                      <button
                        key={cat}
                        onMouseDown={() => selectCategory(cat)}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 bg-transparent border-none cursor-pointer hover:bg-violet-500/10 transition-colors group"
                      >
                        <span className="text-base">&#x1F3F7;&#xFE0F;</span>
                        <span className="text-white/80 text-sm font-medium group-hover:text-violet-300 transition-colors">{cat}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedProducts.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-violet-400/70">
                      Produits
                    </div>
                    {matchedProducts.map((p) => (
                      <button
                        key={p.id}
                        onMouseDown={() => selectProduct(p.name)}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 bg-transparent border-none cursor-pointer hover:bg-violet-500/10 transition-colors group"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-white/10"
                        />
                        <div className="min-w-0">
                          <div className="text-white/85 text-sm font-medium truncate group-hover:text-violet-300 transition-colors">{p.name}</div>
                          <div className="text-violet-400/70 text-xs">{p.category} &middot; {p.price} MAD</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="h-2" />
              </div>
            )}
          </div>

          {/* Bouton Dashboard (admin seulement) + Profil utilisateur */}
          {userRole ? (
            <div className="hidden md:flex items-center gap-2">
              {userRole === "admin" && (
                <button
                  onClick={onDashboard}
                  aria-label="Tableau de bord"
                  title="Tableau de bord admin"
                  className="bg-violet-600/20 border border-violet-500/40 rounded-full w-9 h-9 text-violet-400 cursor-pointer flex items-center justify-center hover:bg-violet-500/30 hover:scale-105 transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                </button>
              )}

              {/* Profile pill → dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-1 pr-3 py-1 cursor-pointer hover:border-violet-500/40 hover:bg-violet-500/8 transition-all"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                    userRole === "admin" ? "bg-violet-600" : "bg-cyan-600"
                  }`}>
                    {(userPrenom || userName).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white/75 text-sm font-medium">
                    {userPrenom || userName}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                    userRole === "admin"
                      ? "bg-violet-500/20 text-violet-400"
                      : "bg-cyan-500/20 text-cyan-400"
                  }`}>{userRole}</span>
                  {/* chevron */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className={`w-3 h-3 text-white/30 transition-transform ${profileOpen ? "rotate-180" : ""}`}>
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>

                {/* Dropdown card */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#0f0f1e] border border-violet-500/25 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                    {/* Accent line */}
                    <div className={`h-0.5 w-full ${userRole === "admin" ? "bg-gradient-to-r from-violet-600 to-purple-500" : "bg-gradient-to-r from-cyan-600 to-teal-500"}`} />

                    {/* Avatar + name block */}
                    <div className="px-5 pt-5 pb-4 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 ${
                        userRole === "admin" ? "bg-violet-600/30 border border-violet-500/40" : "bg-cyan-600/30 border border-cyan-500/40"
                      }`}>
                        {(userPrenom || userName).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-bold text-base truncate">{userName}</div>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${
                          userRole === "admin"
                            ? "bg-violet-500/20 text-violet-400"
                            : "bg-cyan-500/20 text-cyan-400"
                        }`}>{userRole}</span>
                      </div>
                    </div>

                    {/* Prénom / Nom rows */}
                    <div className="px-5 pb-4 flex flex-col gap-2.5">
                      <div className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 flex items-center gap-3">
                        <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 flex-shrink-0 ${userRole === "admin" ? "text-violet-400" : "text-cyan-400"}`}>
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <div>
                          <div className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">Prénom</div>
                          <div className="text-white text-sm font-medium">{userPrenom || "—"}</div>
                        </div>
                      </div>
                      <div className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 flex items-center gap-3">
                        <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 flex-shrink-0 ${userRole === "admin" ? "text-violet-400" : "text-cyan-400"}`}>
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                        <div>
                          <div className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">Nom</div>
                          <div className="text-white text-sm font-medium">{userNom || "—"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Divider + logout */}
                    <div className="border-t border-white/8 px-5 py-3">
                      <button
                        onClick={() => { setProfileOpen(false); onLogout(); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-transparent border-none cursor-pointer text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                        </svg>
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onLoginOpen}
              className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/70 hover:bg-violet-500/15 hover:border-violet-500/40 hover:text-violet-300 cursor-pointer text-sm font-semibold transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
              </svg>
              Connexion
            </button>
          )}

          {/* Bouton panier */}
          <button
            onClick={onCartOpen}
            aria-label="Ouvrir le panier"
            className="relative bg-gradient-to-br from-violet-600 to-purple-700 border-none rounded-full w-11 h-11 text-xl cursor-pointer flex items-center justify-center hover:from-violet-500 hover:to-purple-600 hover:scale-105 hover:shadow-[0_4px_20px_rgba(124,58,237,0.5)] transition-all"
          >
            &#x1F6D2;
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden bg-transparent border-none text-white text-2xl cursor-pointer"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "&#x2715;" : "&#x2630;"}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d0d1a]/97 border-b border-violet-500/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                if (onNavigateSection) onNavigateSection(l.path);
                else smoothScrollTo(l.href.slice(1));
              }}
              className="text-white/80 no-underline font-medium text-base hover:text-violet-400 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
