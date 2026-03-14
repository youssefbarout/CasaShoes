import { useState } from "react";
import { products } from "../data/products";

// ─── Utilitaires dates & séries ─────────────────────────────────────
const monthLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function parseOrderDate(value) {
  if (!value || typeof value !== "string") return null;
  const parts = value.split("/");
  if (parts.length !== 3) return null;

  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = Number(parts[2]);
  if ([day, month, year].some((v) => Number.isNaN(v))) return null;

  return new Date(year, month, day);
}

function buildMonthlySeries(orders, count = 7) {
  const now = new Date();
  const buckets = [];

  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: monthLabels[d.getMonth()],
      revenue: 0,
      orders: 0,
    });
  }

  const byKey = new Map(buckets.map((b) => [b.key, b]));
  orders.forEach((order) => {
    const d = parseOrderDate(order.date);
    if (!d) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const bucket = byKey.get(key);
    if (!bucket) return;
    bucket.revenue += Number(order.amount) || 0;
    bucket.orders += 1;
  });

  return buckets;
}

const initialRecentOrders = [
  { id: "#CS-1042", client: "Yassine B.", product: "Jordan 1 Retro High", size: 42, amount: 1990, status: "Livré", date: "09/03/2026" },
  { id: "#CS-1041", client: "Fatima Z.", product: "Adidas Ultraboost 22", size: 38, amount: 1450, status: "En cours", date: "09/03/2026" },
  { id: "#CS-1040", client: "Omar E.", product: "Nike Air Max 270", size: 43, amount: 1299, status: "Livré", date: "08/03/2026" },
  { id: "#CS-1039", client: "Sara M.", product: "Converse Chuck Taylor", size: 37, amount: 780, status: "En attente", date: "08/03/2026" },
  { id: "#CS-1038", client: "Karim A.", product: "Timberland 6-Inch Boot", size: 44, amount: 2150, status: "Livré", date: "07/03/2026" },
  { id: "#CS-1037", client: "Nadia H.", product: "Birkenstock Arizona", size: 39, amount: 920, status: "Annulé", date: "07/03/2026" },
  { id: "#CS-1036", client: "Mehdi T.", product: "Vans Old Skool", size: 41, amount: 699, status: "Livré", date: "06/03/2026" },
];

const categoryColors = {
  Homme: { bg: "bg-violet-500/20", text: "text-violet-400", bar: "bg-violet-500" },
  Femme: { bg: "bg-pink-500/20", text: "text-pink-400", bar: "bg-pink-500" },
  Enfant: { bg: "bg-amber-500/20", text: "text-amber-400", bar: "bg-amber-500" },
  Sport: { bg: "bg-cyan-500/20", text: "text-cyan-400", bar: "bg-cyan-500" },
};

const statusStyle = {
  "Livré": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "En cours": "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "En attente": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Annulé": "bg-red-500/15 text-red-400 border-red-500/30",
};

// ─── Composants utilitaires ─────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`relative rounded-2xl border p-5 overflow-hidden ${color.border} ${color.bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/45 text-xs font-semibold uppercase tracking-widest mb-1">{label}</p>
          <p className={`text-3xl font-extrabold ${color.text}`}>{value}</p>
          {sub && <p className="text-white/40 text-xs mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color.iconBg}`}>
          {icon}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${color.line}`} />
    </div>
  );
}

// ─── Composant principal ─────────────────────────────────────────────
export default function Dashboard({ onClose, onLogout, productsData, ordersData, onProductsChange, onOrdersChange, currentTab, onTabChange }) {
  const [internalTab, setInternalTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [fallbackProducts, setFallbackProducts] = useState(products);
  const [fallbackOrders, setFallbackOrders] = useState(initialRecentOrders);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddOrderForm, setShowAddOrderForm] = useState(false);
  const emptyForm = { name: "", category: "Homme", price: "", originalPrice: "", badge: "", image: "", rating: "4.5", reviews: "0" };
  const emptyOrderForm = { client: "", product: "", size: "42", amount: "", status: "En attente" };
  const [form, setForm] = useState(emptyForm);
  const [orderForm, setOrderForm] = useState(emptyOrderForm);
  const [formError, setFormError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");

  const localProducts = productsData ?? fallbackProducts;
  const orders = ordersData ?? fallbackOrders;
  const setLocalProducts = onProductsChange ?? setFallbackProducts;
  const setOrders = onOrdersChange ?? setFallbackOrders;
  const allowedTabs = ["overview", "produits", "commandes"];
  const tab = allowedTabs.includes(currentTab) ? currentTab : internalTab;
  const changeTab = onTabChange ?? setInternalTab;

  const monthlySeries = buildMonthlySeries(orders, 7);
  const months = monthlySeries.map((m) => m.label);
  const revenueData = monthlySeries.map((m) => m.revenue);
  const monthlyOrdersData = monthlySeries.map((m) => m.orders);
  const maxRevenue = Math.max(1, ...revenueData);
  const totalRevenueMois = revenueData[revenueData.length - 1] ?? 0;
  const totalOrdersMois = monthlyOrdersData[monthlyOrdersData.length - 1] ?? 0;
  const prevRevenueMois = revenueData[revenueData.length - 2] ?? 0;
  const prevOrdersMois = monthlyOrdersData[monthlyOrdersData.length - 2] ?? 0;
  const revenueDeltaPct = prevRevenueMois > 0 ? ((totalRevenueMois - prevRevenueMois) / prevRevenueMois) * 100 : 0;
  const ordersDeltaPct = prevOrdersMois > 0 ? ((totalOrdersMois - prevOrdersMois) / prevOrdersMois) * 100 : 0;

  const totalProducts = localProducts.length;
  const avgRating = (
    localProducts.length
      ? localProducts.reduce((s, p) => s + p.rating, 0) / localProducts.length
      : 0
  ).toFixed(1);

  const catCount = localProducts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  const maxCat = Math.max(1, ...Object.values(catCount));

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Veuillez choisir un fichier image valide.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: String(reader.result || "") }));
      setSelectedImageName(file.name);
      setFormError("");
    };
    reader.onerror = () => {
      setFormError("Impossible de lire l'image sélectionnée.");
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) { setFormError("Nom et prix sont obligatoires."); return; }
    const newP = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      badge: form.badge || null,
      image: form.image.trim() || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
      rating: Number(form.rating) || 4.5,
      reviews: Number(form.reviews) || 0,
      colors: [],
      sizes: [38, 39, 40, 41, 42, 43, 44],
      colorImages: [],
    };
    setLocalProducts((prev) => [newP, ...prev]);
    setForm(emptyForm);
    setSelectedImageName("");
    setShowAddForm(false);
  };

  const handleOrderFormChange = (e) => {
    setOrderForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setOrderError("");
  };

  const handleAddOrder = (e) => {
    e.preventDefault();

    if (!orderForm.client.trim() || !orderForm.product.trim() || !orderForm.amount) {
      setOrderError("Client, produit et montant sont obligatoires.");
      return;
    }

    const parsedAmount = Number(orderForm.amount);
    const parsedSize = Number(orderForm.size);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setOrderError("Le montant doit être un nombre supérieur à 0.");
      return;
    }

    const maxId = orders.reduce((max, o) => {
      const num = Number(String(o.id).replace("#CS-", ""));
      return Number.isFinite(num) ? Math.max(max, num) : max;
    }, 1000);

    const newOrder = {
      id: `#CS-${maxId + 1}`,
      client: orderForm.client.trim(),
      product: orderForm.product.trim(),
      size: Number.isNaN(parsedSize) || parsedSize <= 0 ? 42 : parsedSize,
      amount: parsedAmount,
      status: orderForm.status,
      date: new Date().toLocaleDateString("fr-FR"),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setOrderForm(emptyOrderForm);
    setOrderError("");
    setShowAddOrderForm(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#07070f]/98 backdrop-blur-sm overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a14]/95 backdrop-blur-md border-b border-violet-500/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-violet-400">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-white font-extrabold text-lg leading-none">Tableau de bord</h1>
              <p className="text-white/40 text-xs">CasaShoes Admin · Mars 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-full p-1 gap-1">
              {["overview", "produits", "commandes"].map((t) => (
                <button
                  key={t}
                  onClick={() => changeTab(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none capitalize transition-all ${
                    tab === t
                      ? "bg-violet-600 text-white shadow-[0_2px_10px_rgba(124,58,237,0.4)]"
                      : "bg-transparent text-white/50 hover:text-white"
                  }`}
                >
                  {t === "overview" ? "Vue générale" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Se déconnecter"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/50 hover:bg-orange-500/15 hover:border-orange-500/30 hover:text-orange-400 cursor-pointer text-xs font-semibold transition-all"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Déconnexion
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/15 text-white/60 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 cursor-pointer flex items-center justify-center transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── TAB : VUE GÉNÉRALE ── */}
        {tab === "overview" && (
          <div className="flex flex-col gap-8">

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-violet-400"><path d="M20 6h-2.18c.07-.44.18-.86.18-1a3 3 0 00-6 0c0 .14.11.56.18 1H9.18C9.25 5.56 9.36 5.14 9.36 5a3 3 0 00-6 0c0 .14.11.56.18 1H2a1 1 0 00-1 1v13a1 1 0 001 1h18a1 1 0 001-1V7a1 1 0 00-1-1z"/></svg>}
                label="Produits en catalogue"
                value={totalProducts}
                sub="4 catégories actives"
                color={{ bg: "bg-violet-500/8", border: "border-violet-500/20", text: "text-violet-400", iconBg: "bg-violet-500/15", line: "bg-violet-500/40" }}
              />
              <StatCard
                icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-400"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                label="Commandes ce mois"
                value={totalOrdersMois}
                sub={`${ordersDeltaPct >= 0 ? "+" : ""}${ordersDeltaPct.toFixed(1)}% vs mois dernier`}
                color={{ bg: "bg-emerald-500/8", border: "border-emerald-500/20", text: "text-emerald-400", iconBg: "bg-emerald-500/15", line: "bg-emerald-500/40" }}
              />
              <StatCard
                icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-400"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>}
                label="Revenu ce mois"
                value={`${(totalRevenueMois / 1000).toFixed(1)}k MAD`}
                sub={`${revenueDeltaPct >= 0 ? "+" : ""}${revenueDeltaPct.toFixed(1)}% vs mois dernier`}
                color={{ bg: "bg-amber-500/8", border: "border-amber-500/20", text: "text-amber-400", iconBg: "bg-amber-500/15", line: "bg-amber-500/40" }}
              />
              <StatCard
                icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pink-400"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
                label="Note moyenne"
                value={`${avgRating} / 5`}
                sub={`sur ${localProducts.reduce((s, p) => s + p.reviews, 0).toLocaleString()} avis`}
                color={{ bg: "bg-pink-500/8", border: "border-pink-500/20", text: "text-pink-400", iconBg: "bg-pink-500/15", line: "bg-pink-500/40" }}
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Revenus mensuels */}
              <div className="lg:col-span-2 bg-[#10101e] border border-violet-500/12 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-bold text-base">Revenus mensuels</h3>
                    <p className="text-white/40 text-xs mt-0.5">7 derniers mois (MAD)</p>
                  </div>
                  <span className="text-emerald-400 bg-emerald-500/12 border border-emerald-500/25 text-xs font-bold px-3 py-1 rounded-full">
                    {revenueDeltaPct >= 0 ? "↑" : "↓"} {`${revenueDeltaPct >= 0 ? "+" : ""}${revenueDeltaPct.toFixed(1)}%`}
                  </span>
                </div>
                <div className="flex items-end gap-2.5 h-44">
                  {revenueData.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-white/40 text-[10px] font-medium">
                        {i === revenueData.length - 1 ? <span className="text-amber-400 font-bold">{(val / 1000).toFixed(0)}k</span> : `${(val / 1000).toFixed(0)}k`}
                      </span>
                      <div className="w-full relative rounded-t-lg overflow-hidden" style={{ height: `${(val / maxRevenue) * 140}px` }}>
                        <div
                          className={`w-full h-full rounded-t-lg ${i === revenueData.length - 1 ? "bg-gradient-to-t from-amber-600 to-amber-400" : "bg-gradient-to-t from-violet-700 to-violet-500"} hover:brightness-110 transition-all cursor-default`}
                        />
                      </div>
                      <span className={`text-[10px] font-semibold ${i === revenueData.length - 1 ? "text-amber-400" : "text-white/40"}`}>{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Répartition par catégorie */}
              <div className="bg-[#10101e] border border-violet-500/12 rounded-2xl p-6">
                <h3 className="text-white font-bold text-base mb-1">Par catégorie</h3>
                <p className="text-white/40 text-xs mb-6">Répartition du catalogue</p>
                <div className="flex flex-col gap-4">
                  {Object.entries(catCount).map(([cat, count]) => {
                    const c = categoryColors[cat] ?? { bg: "bg-white/10", text: "text-white/60", bar: "bg-white/40" };
                    return (
                      <div key={cat}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className={`text-sm font-semibold ${c.text}`}>{cat}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>{count} produits</span>
                        </div>
                        <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.bar} transition-all duration-700`}
                            style={{ width: `${(count / maxCat) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Commandes récentes (aperçu) */}
            <div className="bg-[#10101e] border border-violet-500/12 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/6 flex items-center justify-between">
                <h3 className="text-white font-bold">Commandes récentes</h3>
                <button onClick={() => changeTab("commandes")} className="text-violet-400 text-xs font-semibold hover:text-violet-300 cursor-pointer bg-transparent border-none transition-colors">
                  Voir tout →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/30 text-xs uppercase tracking-wider">
                      <th className="text-left px-6 py-3 font-semibold">Réf</th>
                      <th className="text-left px-4 py-3 font-semibold">Client</th>
                      <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Produit</th>
                      <th className="text-right px-4 py-3 font-semibold">Montant</th>
                      <th className="text-center px-4 py-3 font-semibold">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order, i) => (
                      <tr key={order.id} className={`border-t border-white/4 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                        <td className="px-6 py-3.5 text-violet-400 font-mono font-bold text-xs">{order.id}</td>
                        <td className="px-4 py-3.5 text-white font-medium">{order.client}</td>
                        <td className="px-4 py-3.5 text-white/55 hidden md:table-cell">{order.product}</td>
                        <td className="px-4 py-3.5 text-amber-400 font-bold text-right">{order.amount.toLocaleString()} MAD</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB : PRODUITS ── */}
        {tab === "produits" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-extrabold text-xl">Catalogue produits</h2>
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-sm">{localProducts.length} produits</span>
                <button
                  onClick={() => { setShowAddForm((v) => !v); setFormError(""); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer border transition-all ${
                    showAddForm
                      ? "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25"
                      : "bg-violet-600/20 border-violet-500/40 text-violet-300 hover:bg-violet-600/30"
                  }`}
                >
                  {showAddForm ? (
                    <><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>Annuler</>
                  ) : (
                    <><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>Ajouter un produit</>
                  )}
                </button>
              </div>
            </div>

            {/* ── Formulaire d'ajout ── */}
            {showAddForm && (
              <form onSubmit={handleAddProduct} className="bg-[#10101e] border border-violet-500/25 rounded-2xl p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-violet-400"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  </div>
                  <h3 className="text-white font-bold text-base">Nouveau produit</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-white/45 text-xs font-semibold uppercase tracking-wider">Nom du produit *</label>
                    <input name="name" value={form.name} onChange={handleFormChange} required placeholder="Ex: Nike Air Max 90" className="bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all" />
                  </div>

                  {/* Catégorie */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/45 text-xs font-semibold uppercase tracking-wider">Catégorie *</label>
                    <select name="category" value={form.category} onChange={handleFormChange} className="bg-[#0f0f1e] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm outline-none focus:border-violet-500/60 transition-all cursor-pointer">
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                      <option value="Enfant">Enfant</option>
                      <option value="Sport">Sport</option>
                    </select>
                  </div>

                  {/* Badge */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/45 text-xs font-semibold uppercase tracking-wider">Badge</label>
                    <select name="badge" value={form.badge} onChange={handleFormChange} className="bg-[#0f0f1e] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm outline-none focus:border-violet-500/60 transition-all cursor-pointer">
                      <option value="">Aucun</option>
                      <option value="Nouveau">Nouveau</option>
                      <option value="Promo">Promo</option>
                      <option value="Bestseller">Bestseller</option>
                    </select>
                  </div>

                  {/* Prix */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/45 text-xs font-semibold uppercase tracking-wider">Prix (MAD) *</label>
                    <input name="price" value={form.price} onChange={handleFormChange} type="number" min="0" required placeholder="1299" className="bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all" />
                  </div>

                  {/* Prix original */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/45 text-xs font-semibold uppercase tracking-wider">Prix barré (MAD)</label>
                    <input name="originalPrice" value={form.originalPrice} onChange={handleFormChange} type="number" min="0" placeholder="1599" className="bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all" />
                  </div>

                  {/* Note */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/45 text-xs font-semibold uppercase tracking-wider">Note (0–5)</label>
                    <input name="rating" value={form.rating} onChange={handleFormChange} type="number" min="0" max="5" step="0.1" placeholder="4.5" className="bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all" />
                  </div>

                  {/* Avis */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/45 text-xs font-semibold uppercase tracking-wider">Nombre d&apos;avis</label>
                    <input name="reviews" value={form.reviews} onChange={handleFormChange} type="number" min="0" placeholder="0" className="bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all" />
                  </div>

                  {/* Image file */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-white/45 text-xs font-semibold uppercase tracking-wider">Image du produit</label>
                    <div className="flex flex-col gap-2">
                      <label className="bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm cursor-pointer hover:border-violet-500/60 hover:bg-violet-500/5 transition-all">
                        Choisir une image depuis un dossier
                        <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                      </label>
                      <p className="text-xs text-white/45">
                        {selectedImageName ? `Image sélectionnée: ${selectedImageName}` : "Aucune image sélectionnée. Une image par défaut sera utilisée."}
                      </p>
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 bg-red-500/12 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    {formError}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white border-none cursor-pointer hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_4px_16px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    Ajouter au catalogue
                  </button>
                  <button type="button" onClick={() => { setShowAddForm(false); setForm(emptyForm); setFormError(""); setSelectedImageName(""); }} className="px-5 py-3 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-white/50 hover:text-white cursor-pointer transition-all border-none">
                    Annuler
                  </button>
                </div>
              </form>
            )}
            <div className="bg-[#10101e] border border-violet-500/12 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/30 text-xs uppercase tracking-wider bg-white/3">
                      <th className="text-left px-6 py-3.5 font-semibold">Produit</th>
                      <th className="text-left px-4 py-3.5 font-semibold hidden sm:table-cell">Catégorie</th>
                      <th className="text-right px-4 py-3.5 font-semibold">Prix</th>
                      <th className="text-center px-4 py-3.5 font-semibold hidden md:table-cell">Note</th>
                      <th className="text-center px-4 py-3.5 font-semibold hidden lg:table-cell">Avis</th>
                      <th className="text-center px-4 py-3.5 font-semibold">Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localProducts.map((p, i) => {
                      const c = categoryColors[p.category] ?? { bg: "bg-white/10", text: "text-white/60" };
                      return (
                        <tr key={p.id} className={`border-t border-white/4 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-white/5" />
                              <span className="text-white font-semibold text-sm">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 hidden sm:table-cell">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>{p.category}</span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="text-amber-400 font-bold">{p.price} MAD</span>
                            {p.originalPrice && (
                              <span className="block text-white/30 text-xs line-through">{p.originalPrice} MAD</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center hidden md:table-cell">
                            <span className="text-amber-400 font-bold">★ {p.rating}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center text-white/50 hidden lg:table-cell">{p.reviews}</td>
                          <td className="px-4 py-3.5 text-center">
                            {p.badge ? (
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                p.badge === "Promo" ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                : p.badge === "Nouveau" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                              }`}>{p.badge}</span>
                            ) : <span className="text-white/20 text-xs">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB : COMMANDES ── */}
        {tab === "commandes" && (() => {
          const filtered = statusFilter === "Tous" ? orders : orders.filter((o) => o.status === statusFilter);
          return (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-white font-extrabold text-xl">Commandes récentes</h2>
              <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
                {["Tous", "Livré", "En cours", "En attente", "Annulé"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                      statusFilter === s
                        ? s === "Tous" ? "bg-violet-600 border-violet-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                          : statusStyle[s] + " shadow-[0_0_8px_rgba(0,0,0,0.3)] brightness-125"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/25"
                    }`}
                  >{s}</button>
                ))}
                <button
                  onClick={() => {
                    setShowAddOrderForm((v) => !v);
                    setOrderError("");
                  }}
                  className={`ml-1 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                    showAddOrderForm
                      ? "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25"
                      : "bg-violet-600/20 border-violet-500/40 text-violet-300 hover:bg-violet-600/30"
                  }`}
                >
                  {showAddOrderForm ? (
                    <><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>Annuler</>
                  ) : (
                    <><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>Ajouter une commande</>
                  )}
                </button>
              </div>
            </div>

            {showAddOrderForm && (
              <form onSubmit={handleAddOrder} className="bg-[#10101e] border border-violet-500/25 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-white font-bold text-base">Nouvelle commande</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <input
                    name="client"
                    value={orderForm.client}
                    onChange={handleOrderFormChange}
                    placeholder="Client (ex: Sara M.)"
                    className="bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
                    required
                  />
                  <input
                    name="product"
                    value={orderForm.product}
                    onChange={handleOrderFormChange}
                    placeholder="Produit"
                    className="bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all lg:col-span-2"
                    required
                  />
                  <input
                    name="size"
                    value={orderForm.size}
                    onChange={handleOrderFormChange}
                    type="number"
                    min="1"
                    placeholder="Pointure"
                    className="bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
                  />
                  <input
                    name="amount"
                    value={orderForm.amount}
                    onChange={handleOrderFormChange}
                    type="number"
                    min="1"
                    placeholder="Montant (MAD)"
                    className="bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none placeholder-white/25 focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
                    required
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    name="status"
                    value={orderForm.status}
                    onChange={handleOrderFormChange}
                    className="bg-[#0f0f1e] border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none focus:border-violet-500/60 transition-all cursor-pointer"
                  >
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Livré">Livré</option>
                    <option value="Annulé">Annulé</option>
                  </select>

                  <button type="submit" className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white border-none cursor-pointer hover:from-violet-500 hover:to-purple-500 transition-all">
                    Ajouter la commande
                  </button>
                </div>

                {orderError && <p className="text-red-400 text-sm m-0">{orderError}</p>}
              </form>
            )}

            <div className="bg-[#10101e] border border-violet-500/12 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/30 text-xs uppercase tracking-wider bg-white/3">
                      <th className="text-left px-6 py-3.5 font-semibold">Réf</th>
                      <th className="text-left px-4 py-3.5 font-semibold">Client</th>
                      <th className="text-left px-4 py-3.5 font-semibold hidden md:table-cell">Produit</th>
                      <th className="text-center px-4 py-3.5 font-semibold hidden lg:table-cell">Pointure</th>
                      <th className="text-right px-4 py-3.5 font-semibold">Montant</th>
                      <th className="text-center px-4 py-3.5 font-semibold">Statut</th>
                      <th className="text-right px-4 py-3.5 font-semibold hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-white/30 text-sm">Aucune commande pour ce statut.</td></tr>
                    ) : filtered.map((order, i) => (
                      <tr key={order.id} className={`border-t border-white/4 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.015]"}` }>
                        <td className="px-6 py-4 text-violet-400 font-mono font-bold text-xs">{order.id}</td>
                        <td className="px-4 py-4 text-white font-semibold">{order.client}</td>
                        <td className="px-4 py-4 text-white/55 hidden md:table-cell">{order.product}</td>
                        <td className="px-4 py-4 text-center text-white/50 hidden lg:table-cell">{order.size}</td>
                        <td className="px-4 py-4 text-amber-400 font-bold text-right">{order.amount.toLocaleString()} MAD</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-white/35 text-right text-xs hidden sm:table-cell">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Footer total */}
              <div className="px-6 py-4 border-t border-white/6 flex justify-between items-center bg-white/[0.02]">
                <span className="text-white/40 text-sm">{filtered.length} commande{filtered.length !== 1 ? "s" : ""} affichée{filtered.length !== 1 ? "s" : ""}</span>
                <div className="text-right">
                  <span className="text-white/40 text-xs block">Total filtré</span>
                  <span className="text-amber-400 font-extrabold text-lg">{filtered.reduce((s, o) => s + o.amount, 0).toLocaleString()} MAD</span>
                </div>
              </div>
            </div>
          </div>
          );
        })()}

      </div>
    </div>
  );
}
