import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import LoginModal from "./components/LoginModal";
import { products as initialProducts } from "./data/products";
import "./index.css";

const initialRecentOrders = [
  { id: "#CS-1042", client: "Yassine B.", product: "Jordan 1 Retro High", size: 42, amount: 1990, status: "Livré", date: "09/03/2026" },
  { id: "#CS-1041", client: "Fatima Z.", product: "Adidas Ultraboost 22", size: 38, amount: 1450, status: "En cours", date: "09/03/2026" },
  { id: "#CS-1040", client: "Omar E.", product: "Nike Air Max 270", size: 43, amount: 1299, status: "Livré", date: "08/03/2026" },
  { id: "#CS-1039", client: "Sara M.", product: "Converse Chuck Taylor", size: 37, amount: 780, status: "En attente", date: "08/03/2026" },
  { id: "#CS-1038", client: "Karim A.", product: "Timberland 6-Inch Boot", size: 44, amount: 2150, status: "Livré", date: "07/03/2026" },
  { id: "#CS-1037", client: "Nadia H.", product: "Birkenstock Arizona", size: 39, amount: 920, status: "Annulé", date: "07/03/2026" },
  { id: "#CS-1036", client: "Mehdi T.", product: "Vans Old Skool", size: 41, amount: 699, status: "Livré", date: "06/03/2026" },
];

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState(initialProducts);
  const [adminOrders, setAdminOrders] = useState(initialRecentOrders);
  const [cartOpen, setCartOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem("casashoes_role") || null);
  const [userName, setUserName] = useState(() => sessionStorage.getItem("casashoes_name") || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Tous");

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && i.selectedSize === product.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.selectedSize === product.selectedSize
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id, size) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.id === id && i.selectedSize === size))
    );
  };

  const updateQty = (id, size, qty) => {
    if (qty <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.selectedSize === size ? { ...i, qty } : i
      )
    );
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const scrollToProducts = () => {
    document.getElementById("produits")?.scrollIntoView({ behavior: "smooth" });
  };

  const addCartAsOrder = () => {
    if (cartItems.length === 0) return;

    const maxId = adminOrders.reduce((max, o) => {
      const num = Number(String(o.id).replace("#CS-", ""));
      return Number.isFinite(num) ? Math.max(max, num) : max;
    }, 1000);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const first = cartItems[0];
    const productLabel = cartItems.length > 1
      ? `${first.name} +${cartItems.length - 1} article(s)`
      : first.name;

    const newOrder = {
      id: `#CS-${maxId + 1}`,
      client: userName || "Client Web",
      product: productLabel,
      size: first.selectedSize || 42,
      amount: total,
      status: "En attente",
      date: new Date().toLocaleDateString("fr-FR"),
    };

    setAdminOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <div className="app">
      {/* Scroll progress bar */}
      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onSearch={setSearchQuery}
        userRole={userRole}
        userName={userName}
        onLoginOpen={() => setLoginOpen(true)}
        onDashboard={() => setDashboardOpen(true)}
        onLogout={() => {
          sessionStorage.removeItem("casashoes_role");
          sessionStorage.removeItem("casashoes_name");
          setUserRole(null);
          setUserName("");
          setDashboardOpen(false);
        }}
      />
      <Hero onShopNow={scrollToProducts} />
      <Products
        productsData={catalogProducts}
        onAddToCart={addToCart}
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        onSetCategory={setActiveCategory}
      />
      <Footer onCategorySelect={(cat) => {
        setActiveCategory(cat);
        const el = document.getElementById('produits');
        if (el) {
          const navH = document.querySelector('nav')?.offsetHeight ?? 68;
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
        }
      }} />
      {cartOpen && (
        <Cart
          cartItems={cartItems}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
          onOrder={() => {
            addCartAsOrder();
            setCartItems([]);
          }}
        />
      )}

      {loginOpen && (
        <LoginModal
          onSuccess={(role, name) => {
            sessionStorage.setItem("casashoes_role", role);
            sessionStorage.setItem("casashoes_name", name);
            setUserRole(role);
            setUserName(name);
            setLoginOpen(false);
            if (role === "admin") setDashboardOpen(true);
          }}
          onClose={() => setLoginOpen(false)}
        />
      )}

      {dashboardOpen && userRole === "admin" && (
        <Dashboard
          productsData={catalogProducts}
          ordersData={adminOrders}
          onProductsChange={setCatalogProducts}
          onOrdersChange={setAdminOrders}
          onClose={() => setDashboardOpen(false)}
          onLogout={() => {
            sessionStorage.removeItem("casashoes_role");
            sessionStorage.removeItem("casashoes_name");
            setUserRole(null);
            setUserName("");
            setDashboardOpen(false);
          }}
        />
      )}

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/212600000000?text=Bonjour%20CasaShoes!%20Je%20souhaite%20avoir%20plus%20d%27informations."
        target="_blank"
        rel="noreferrer"
        title="Commander sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.5)] hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.7)] transition-all duration-200 no-underline"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}

export default App;
