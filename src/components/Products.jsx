import { useState } from "react";
import { products as defaultProducts, categories as defaultCategories } from "../data/products";
import ProductCard from "./ProductCard";
import { useInView } from "../hooks/useInView";

// Animation variants qui alternent selon l'index de la carte
const variants = ["scale-in", "from-left", "scale-in", "from-right"];

function RevealCard({ children, index }) {
  const [ref, visible] = useInView(0.12, "0px 0px -30px 0px", true);
  const variant = variants[index % variants.length];
  return (
    <div
      ref={ref}
      className={`reveal ${variant} ${visible ? "visible" : ""}`}
      style={{ transitionDelay: visible ? `${(index % 4) * 0.08}s` : "0s" }}
    >
      {children}
    </div>
  );
}

export default function Products({ productsData, onAddToCart, searchQuery, activeCategory = "Tous", onSetCategory }) {
  const setActiveCategory = onSetCategory ?? (() => {});
  const [sortBy, setSortBy] = useState("default");
  const [headerRef, headerVisible] = useInView(0.2);
  const [tabsRef, tabsVisible] = useInView(0.2);

  const sourceProducts = productsData ?? defaultProducts;
  const sourceCategories = sourceProducts.length
    ? ["Tous", ...Array.from(new Set(sourceProducts.map((p) => p.category)))]
    : defaultCategories;

  const filtered = sourceProducts
    .filter((p) => activeCategory === "Tous" || p.category === activeCategory)
    .filter((p) =>
      searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <section id="produits" className="bg-[#0d0d1a] py-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`flex justify-between items-end mb-8 flex-wrap gap-4 reveal ${headerVisible ? "visible" : ""}`}
        >
          <div>
            <span className="inline-block bg-violet-500/12 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-widest px-4 py-1 rounded-full mb-2">
              ✦ Notre catalogue
            </span>
            <h2 className="text-4xl font-black text-white mb-1">
              Nos <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Chaussures</span>
            </h2>
            <p className="text-white/40 text-sm">
              {filtered.length} produit{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-violet-500/8 border border-violet-500/20 text-white px-5 py-2.5 rounded-full text-sm cursor-pointer outline-none focus:border-violet-400 transition-colors"
          >
            <option value="default" className="bg-[#1a1a2e]">Trier par...</option>
            <option value="price-asc" className="bg-[#1a1a2e]">Prix croissant</option>
            <option value="price-desc" className="bg-[#1a1a2e]">Prix décroissant</option>
            <option value="rating" className="bg-[#1a1a2e]">Meilleures notes</option>
          </select>
        </div>

        {/* Categories */}
        <div
          id="categories"
          ref={tabsRef}
          className={`flex flex-wrap gap-2 mb-10 reveal ${tabsVisible ? "visible" : ""}`}
          style={{ transitionDelay: "0.1s" }}
        >
          {sourceCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-all border ${
                activeCategory === cat
                  ? "bg-violet-600 border-violet-600 text-white font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                  : "bg-white/5 border-white/10 text-white/60 hover:border-violet-400 hover:text-violet-300 hover:bg-violet-500/8"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <span className="text-5xl block mb-4">😕</span>
            <p className="text-lg">Aucun produit trouvé pour cette recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <RevealCard key={product.id} index={i}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </RevealCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
