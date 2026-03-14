import { useState } from "react";

export default function Cart({ cartItems, onClose, onRemove, onUpdateQty, onOrder }) {
  const [ordered, setOrdered] = useState(false);
  const [orderedTotal, setOrderedTotal] = useState(0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleOrder = () => {
    const sep = "─────────────────────────";
    const lines = cartItems
      .map((item, i) =>
        `${i + 1}. \uD83D\uDC5F *${item.name}*\n   \uD83D\uDCCF Pointure : ${item.selectedSize}  |  Qt\u00E9 : x${item.qty}\n   \uD83D\uDCB5 ${(item.price * item.qty).toLocaleString()} MAD`
      )
      .join("\n\n");
    const msg = encodeURIComponent(
      `\uD83D\uDED2 *NOUVELLE COMMANDE \u2014 CasaShoes*\n${sep}\n\n${lines}\n\n${sep}\n\uD83D\uDCB0 *Total : ${total.toLocaleString()} MAD*\n${sep}\n\n\uD83D\uDCE6 Livraison sous 48h\n\u2705 Merci de confirmer ma commande !`
    );
    window.open(`https://wa.me/212600000000?text=${msg}`, "_blank");
    setOrderedTotal(total);
    setOrdered(true);
    onOrder();
  };

  if (ordered) {
    return (
      <>
        <div className="fixed inset-0 bg-black/70 z-[1500]" onClick={onClose} />
        <div className="fixed top-0 right-0 h-screen w-[420px] max-w-full bg-[#111120] border-l border-violet-500/15 z-[1600] flex flex-col items-center justify-center gap-6 p-10 text-center" style={{animation: 'slideIn 0.3s ease'}}>
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-extrabold text-white">Commande confirmée !</h2>
          <p className="text-white/55 text-sm leading-relaxed">Merci pour votre achat. Votre commande de <strong className="text-violet-400">{orderedTotal.toLocaleString()} MAD</strong> a été enregistrée et sera livrée sous 48h.</p>
          <button onClick={onClose} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-none px-8 py-3.5 rounded-full text-base font-bold cursor-pointer hover:from-violet-500 hover:to-purple-500 transition-all w-full">Fermer</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-[1500]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-screen w-[420px] max-w-full bg-[#111120] border-l border-violet-500/15 z-[1600] flex flex-col" style={{animation: 'slideIn 0.3s ease'}}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-violet-500/10">
          <h2 className="text-lg font-bold text-white m-0">Mon Panier 🛒</h2>
          <button onClick={onClose} className="bg-white/8 border-none text-white w-9 h-9 rounded-full cursor-pointer text-base flex items-center justify-center hover:bg-red-500/25 transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <p className="text-white/45 text-base">Votre panier est vide</p>
              <button onClick={onClose} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-none px-6 py-2.5 rounded-full text-sm font-bold cursor-pointer hover:from-violet-500 hover:to-purple-500 transition-colors">Continuer les achats</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-3 bg-white/4 border border-white/7 rounded-2xl p-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-0.5">
                  <h4 className="text-sm font-bold text-white m-0">{item.name}</h4>
                  <span className="text-xs text-white/45">Pointure: {item.selectedSize}</span>
                  <span className="text-sm font-bold text-violet-400">{item.price} MAD</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1 bg-white/6 border border-white/10 rounded-full px-1 py-0.5">
                    <button onClick={() => onUpdateQty(item.id, item.selectedSize, item.qty - 1)} className="bg-transparent border-none text-white text-base cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-violet-500/25 hover:text-violet-400 transition-colors">-</button>
                    <span className="text-sm font-bold text-white min-w-5 text-center">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, item.selectedSize, item.qty + 1)} className="bg-transparent border-none text-white text-base cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-violet-500/25 hover:text-violet-400 transition-colors">+</button>
                  </div>
                  <button onClick={() => onRemove(item.id, item.selectedSize)} className="bg-transparent border-none cursor-pointer text-lg opacity-50 hover:opacity-100 hover:scale-125 transition-all">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="px-6 py-5 border-t border-white/8 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Total</span>
              <strong className="text-2xl font-extrabold text-violet-400">{total.toLocaleString()} MAD</strong>
            </div>
            <button onClick={handleOrder} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-none py-4 rounded-xl text-base font-bold cursor-pointer hover:from-violet-500 hover:to-purple-500 transition-all shadow-[0_4px_20px_rgba(124,58,237,0.4)]">Passer la commande →</button>
            <button onClick={onClose} className="bg-transparent border border-white/15 text-white/70 py-3 rounded-xl text-sm cursor-pointer hover:border-violet-400 hover:text-violet-300 transition-all">Continuer les achats</button>
          </div>
        )}
      </div>
    </>
  );
}