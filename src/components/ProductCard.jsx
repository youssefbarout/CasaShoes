import { useState } from "react";

const badgeStyle = {
  Promo: "bg-red-500 text-white",
  Nouveau: "bg-emerald-500 text-white",
  "Best-seller": "bg-orange-500 text-white",
};

export default function ProductCard({ product, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    if (!selectedSize) { alert("Veuillez choisir une pointure !"); return; }
    onAddToCart({ ...product, selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group bg-[#16162a] border border-violet-500/10 rounded-2xl overflow-hidden relative flex flex-col hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(124,58,237,0.25)] hover:border-violet-400/40 transition-all duration-300 min-w-0">
      {/* Badges */}
      {product.badge && (
        <span className={`absolute top-3 left-3 z-10 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${badgeStyle[product.badge] ?? "bg-orange-500 text-white"}`}>
          {product.badge}
        </span>
      )}
      {/* Wishlist */}
      <button
        onClick={() => setWished((w) => !w)}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
          wished ? "bg-red-500 border-red-500 text-white" : "bg-white/10 border-white/20 text-white/60 hover:border-red-400 hover:text-red-400"
        }`}
      >
        {wished ? "❤️" : "🤍"}
      </button>
      {discount && (
        <span className="absolute top-14 right-3 z-10 bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold px-2.5 py-1 rounded-xl">
          -{discount}%
        </span>
      )}

      {/* Image */}
      <div className="h-64 overflow-hidden bg-[#0d0d1a] flex items-center justify-center relative">
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        <img
          key={selectedColor}
          src={product.colorImages?.[selectedColor] ?? product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 animate-[fadeIn_0.35s_ease]"
        />
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-3 flex-1 min-h-[220px]">
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-white leading-tight">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-sm text-amber-400">
          {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
          <span className="text-white font-semibold">{product.rating}</span>
          <span className="text-white/40 text-xs">({product.reviews})</span>
        </div>

        {/* Colors */}
        <div className="flex gap-1.5 items-center">
          {product.colors.map((c, i) => (
            <button
              key={i}
              onClick={() => setSelectedColor(i)}
              title={c}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                selectedColor === i
                  ? "scale-[1.35] shadow-[0_0_0_3px_rgba(255,255,255,0.25)] border-white"
                  : "border-white/20 hover:scale-110 hover:border-white/50"
              }`}
              style={{ background: c }}
            />
          ))}
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1.5">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`px-2 py-1 rounded-lg text-xs cursor-pointer transition-all border ${
                selectedSize === s
                  ? "bg-violet-600 border-violet-600 text-white font-bold shadow-[0_0_8px_rgba(124,58,237,0.4)]"
                  : "bg-white/5 border-white/10 text-white/70 hover:border-violet-400 hover:text-violet-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-violet-400">{product.price} MAD</span>
            {product.originalPrice && (
              <span className="text-xs text-white/35 line-through">{product.originalPrice} MAD</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all border-none whitespace-nowrap ${
              added ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 hover:scale-105 hover:shadow-[0_4px_15px_rgba(124,58,237,0.5)]"
            }`}
          >
            {added ? "\u2713 Ajout\u00e9" : "+ Panier"}
          </button>
        </div>

      </div>
    </div>
  );
}
