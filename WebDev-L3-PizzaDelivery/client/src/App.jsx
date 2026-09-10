import { useMemo, useState, useEffect } from "react";
import "./App.css";
import Checkout from "./Checkout";
import Auth from "./Auth";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import ResetPassword from "./ResetPassword";
import CustomPizza from "./CustomPizza";
import OrderTracking from "./OrderTracking";
import EmailVerification from "./EmailVerification";
const pizzas = [
  {
    id: 1,
    name: "Truffle Margherita",
    category: "Classic",
    description: "San Marzano tomato, buffalo mozzarella, basil & truffle oil.",
    price: 1,
    rating: 4.9,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 2,
    name: "Pepperoni Royale",
    category: "Signature",
    description: "Premium pepperoni, mozzarella, parmesan & roasted tomato.",
    price: 499,
    rating: 4.8,
    reviews: 214,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 3,
    name: "Garden Burrata",
    category: "Veggie",
    description: "Roasted vegetables, burrata, basil pesto & fresh herbs.",
    price: 479,
    rating: 4.9,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 4,
    name: "Spicy Chicken",
    category: "Signature",
    description: "Spiced chicken, roasted peppers, red onion & smoked cheese.",
    price: 529,
    rating: 4.8,
    reviews: 173,
    image:
      "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 5,
    name: "Four Cheese",
    category: "Classic",
    description: "Mozzarella, parmesan, provolone & creamy blue cheese.",
    price: 459,
    rating: 4.7,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 6,
    name: "BBQ Chicken",
    category: "Signature",
    description: "Smoky BBQ chicken, caramelized onion, mozzarella & herbs.",
    price: 519,
    rating: 4.8,
    reviews: 145,
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=90",
  },
];

const categories = [
  { name: "All", icon: "🍕" },
  { name: "Classic", icon: "🇮🇹" },
  { name: "Signature", icon: "🔥" },
  { name: "Veggie", icon: "🌿" },
];

function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
 const [cartOpen, setCartOpen] = useState(false);
const [checkoutOpen, setCheckoutOpen] = useState(false);
const [search, setSearch] = useState("");
const [showAuth, setShowAuth] = useState(false);
const [showCustomPizza, setShowCustomPizza] = useState(false);
const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("crustCoUser");
  return savedUser ? JSON.parse(savedUser) : null;
});
const [admin, setAdmin] = useState(() => {
  const savedAdmin = localStorage.getItem("crustCoAdmin");
  return savedAdmin ? JSON.parse(savedAdmin) : null;
});
const [showAdminLogin, setShowAdminLogin] = useState(false);
const isAdminLogin =
  window.location.pathname === "/admin";
  const isCustomerLogin =
  window.location.pathname === "/login";
useEffect(() => {
  const openAdminLogin = () => setShowAdminLogin(true);

  window.addEventListener("openAdminLogin", openAdminLogin);

  return () => {
    window.removeEventListener("openAdminLogin", openAdminLogin);
  };
}, []);

const handleLogout = () => {
  localStorage.removeItem("crustCoToken");
  localStorage.removeItem("crustCoUser");
  setUser(null);
};
useEffect(() => {
  fetch("http://localhost:5001/")
    .then((res) => res.json())
    .then((data) => {
      console.log("Backend connected:", data);
    })
    .catch((error) => {
      console.error("Backend connection failed:", error);
    });
}, []);

  const filteredPizzas = useMemo(() => {
    return pizzas.filter((pizza) => {
      const matchesCategory =
        activeCategory === "All" || pizza.category === activeCategory;

      const matchesSearch = pizza.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const addToCart = (pizza) => {
  setCart((current) => {
    const existingItem = current.find((item) => item.id === pizza.id);

    if (existingItem) {
      return current.map((item) =>
        item.id === pizza.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    }

    return [...current, { ...pizza, quantity: 1 }];
  });
};

  const removeFromCart = (index) => {
  setCart((current) => current.filter((_, i) => i !== index));
};

const increaseQuantity = (id) => {
  setCart((current) =>
    current.map((item) =>
      item.id === id
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    )
  );
};

const decreaseQuantity = (id) => {
  setCart((current) =>
    current
      .map((item) =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};
const resetToken = new URLSearchParams(
  window.location.search
).get("token");

const isResetPassword =
  window.location.pathname === "/reset-password" &&
  resetToken;
  const trackingMatch =
  window.location.pathname.match(/^\/track\/(.+)$/);

const trackingOrderId = trackingMatch
  ? trackingMatch[1]
  : null;
  const cartTotal = cart.reduce(
  (total, pizza) => total + pizza.price * (pizza.quantity || 1),
  0
);
if (trackingOrderId) {
  return (
    <OrderTracking
      orderId={trackingOrderId}
      onBack={() => {
        window.history.pushState({}, "", "/");
        window.location.reload();
      }}
    />
  );
}
const isEmailVerification =
  window.location.pathname === "/verify-email";

if (isEmailVerification) {
  return (
    <EmailVerification
      onBack={() => {
        window.history.pushState({}, "", "/");
        window.location.reload();
      }}
    />
  );
}
if (isResetPassword) {
  return (
    <ResetPassword
      token={resetToken}
      onBack={() => {
        window.history.pushState({}, "", "/");
        window.location.reload();
      }}
    />
  );
}

if (showCustomPizza) {
  return (
    <CustomPizza
      onBack={() => setShowCustomPizza(false)}
      onAddToCart={(customPizza) => {
        setCart((current) => [...current, customPizza]);
        setShowCustomPizza(false);
        setCartOpen(true);
      }}
    />
  );
}
if (isCustomerLogin || showAuth) {
  return (
    <Auth
      onLogin={(loggedInUser) => {
        setUser(loggedInUser);
        setShowAuth(false);

        window.history.pushState({}, "", "/");
        window.location.reload();
      }}
      onBack={() => {
        window.history.pushState({}, "", "/");
        window.location.reload();
      }}
    />
  );
}
if (admin) {
  return (
    <AdminDashboard
      admin={admin}
      onLogout={() => {
        localStorage.removeItem("crustCoAdminToken");
        localStorage.removeItem("crustCoAdmin");
        setAdmin(null);
      }}
    />
  );
}
if (isAdminLogin || showAdminLogin) {
  return (
    <AdminLogin
      onAdminLogin={(loggedInAdmin) => {
        setAdmin(loggedInAdmin);
        setShowAdminLogin(false);
      }}
    />
  );
}



if (checkoutOpen) {
  return (
    <Checkout
      cart={cart}
      cartTotal={cartTotal}
      onBack={() => setCheckoutOpen(false)}
      onTrackOrder={(orderId) => {
        window.history.pushState(
          {},
          "",
          `/track/${orderId}`
        );
        window.location.reload();
      }}
    />
  );
}

return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <a href="#home" className="logo">
          <span>🍕</span>
          Crust & Co.
        </a>

       <nav>
  <a href="#home">Home</a>
  <a href="#menu">Menu</a>

  <button
    type="button"
    className="nav-custom-button"
    onClick={() => setShowCustomPizza(true)}
  >
    Build Your Pizza
  </button>

  <a href="#offers">Offers</a>
  <a href="#about">About</a>
</nav>

        <div className="nav-actions">
          <button
            className="location-button"
            onClick={() => alert("Delivery location selector coming next.")}
          >
            <span>⌖</span>
            <span>Deliver to</span>
          </button>

          <button
            className="cart-button"
            onClick={() => setCartOpen(true)}
          >
            🛒
            <span>Cart</span>
           {cart.length > 0 && (
  <strong className="cart-count">
    {cart.reduce((total, pizza) => total + (pizza.quantity || 1), 0)}
  </strong>
)}
          </button>
 {user ? (
  <button
    className="location-button"
    onClick={handleLogout}
  >
    Logout
  </button>
) : (
  <button
    className="location-button"
    onClick={() => setShowAuth(true)}
  >
    Login / Create Account
  </button>
)}
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span>✦</span>
              Crafted fresh. Delivered fast.
            </div>

            <h1>
              Pizza worth
              <span>coming back for.</span>
            </h1>

            <p>
              Hand-stretched dough, premium ingredients and a perfectly
              blistered crust. Your next favorite pizza is just a few clicks
              away.
            </p>

            <div className="hero-actions">
              <a href="#menu" className="primary-button">
                Explore the menu <span>→</span>
              </a>

              <button
                className="text-button"
                onClick={() => alert("20% OFF on your first order")}
              >
                Get 20% off your first order
              </button>
            </div>

            <div className="hero-proof">
              <div className="avatar-stack">
                <span>👨🏻</span>
                <span>👩🏻</span>
                <span>👨🏽</span>
                <span>👩🏽</span>
              </div>

              <div>
                <strong>4.9/5</strong>
                <span>Loved by 10,000+ pizza fans</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow" />

            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=90"
                alt="Freshly baked Margherita pizza"
              />
            </div>

            <div className="floating-card rating-card">
              <span className="floating-icon">★</span>
              <div>
                <strong>4.9</strong>
                <small>Top rated</small>
              </div>
            </div>

            <div className="floating-card delivery-card">
              <span className="floating-icon">⚡</span>
              <div>
                <strong>25 min</strong>
                <small>Average delivery</small>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="category-section">
          <div className="section-topline">
            <div>
              <span className="section-label">EXPLORE</span>
              <h2>What are you craving?</h2>
            </div>

            <span className="category-note">
              Freshly made to order
            </span>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category.name}
                className={
                  activeCategory === category.name
                    ? "category active"
                    : "category"
                }
                onClick={() => setActiveCategory(category.name)}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* MENU */}
        <section className="menu-section" id="menu">
          <div className="menu-heading">
            <div>
              <span className="section-label">OUR MENU</span>
              <h2>Made for serious pizza lovers.</h2>
            </div>

            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search pizza..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="pizza-grid">
            {filteredPizzas.map((pizza) => (
              <article className="pizza-card" key={pizza.id}>
                <div className="pizza-card-image">
                  <img src={pizza.image} alt={pizza.name} />

                  <button
                    className="quick-add"
                    onClick={() => addToCart(pizza)}
                    aria-label={`Add ${pizza.name} to cart`}
                  >
                    +
                  </button>

                  <span className="category-tag">{pizza.category}</span>
                </div>

                <div className="pizza-card-content">
                  <div className="pizza-title-row">
                    <h3>{pizza.name}</h3>
                    <strong>₹{pizza.price}</strong>
                  </div>

                  <p>{pizza.description}</p>

                  <div className="pizza-meta">
                    <span>
                      <b>★</b> {pizza.rating}
                    </span>

                    <span>{pizza.reviews} reviews</span>

                    <button onClick={() => addToCart(pizza)}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* OFFER */}
        <section className="offer-section" id="offers">
          <div className="offer-content">
            <span className="section-label">TODAY'S SPECIAL</span>

            <h2>
              Your first slice
              <span>is on us.</span>
            </h2>

            <p>
              Get 20% off your first order. Because discovering your new
              favorite pizza should come with a little reward.
            </p>

            <button
              className="offer-button"
              onClick={() => alert("Promo code: CRUST20")}
            >
              Claim 20% off →
            </button>
          </div>

          <div className="offer-visual">
            <div className="offer-circle">🍕</div>
            <span className="offer-spark spark-one">✦</span>
            <span className="offer-spark spark-two">✦</span>
          </div>
        </section>

        {/* WHY US */}
        <section className="why-section" id="about">
          <div className="why-heading">
            <span className="section-label">WHY CRUST & CO.</span>
            <h2>We take pizza personally.</h2>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <span>01</span>
              <div className="why-icon">🌾</div>
              <h3>Better ingredients</h3>
              <p>
                Premium flour, fresh produce and carefully sourced cheese go
                into every pizza.
              </p>
            </div>

            <div className="why-card featured">
              <span>02</span>
              <div className="why-icon">🔥</div>
              <h3>Perfectly baked</h3>
              <p>
                High heat creates that beautiful blistered crust while keeping
                the center light and delicious.
              </p>
            </div>

            <div className="why-card">
              <span>03</span>
              <div className="why-icon">⚡</div>
              <h3>Fast delivery</h3>
              <p>
                We move quickly without compromising the quality of the pizza
                that reaches your door.
              </p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="reviews-section">
          <div className="reviews-heading">
            <span className="section-label">THE LOVE</span>
            <h2>Don't just take our word for it.</h2>
          </div>

          <div className="review-grid">
            <article className="review-card">
              <div className="stars">★★★★★</div>
              <p>
                “The crust is genuinely incredible. Crispy outside, airy inside
                and the ingredients taste ridiculously fresh.”
              </p>
              <strong>— Riya Sharma</strong>
            </article>

            <article className="review-card">
              <div className="stars">★★★★★</div>
              <p>
                “Finally a pizza delivery site that feels premium from ordering
                to the first bite. The Pepperoni Royale is 🔥.”
              </p>
              <strong>— Arjun Mehta</strong>
            </article>

            <article className="review-card">
              <div className="stars">★★★★★</div>
              <p>
                “Fast delivery, beautiful packaging and seriously good pizza.
                Crust & Co. is now our weekend ritual.”
              </p>
              <strong>— Neha Kapoor</strong>
            </article>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="logo">
            <span>🍕</span>
            Crust & Co.
          </div>
          <p>Good pizza. Great moments.</p>
        </div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#offers">Offers</a>
          <a href="#about">About</a>
        </div>

        <span className="copyright">© 2026 Crust & Co.</span>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <span className="section-label">YOUR ORDER</span>
                <h2>Your cart</h2>
              </div>

              <button
                className="close-cart"
                onClick={() => setCartOpen(false)}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>🍕</span>
                <h3>Your cart is empty</h3>
                <p>Add something delicious from our menu.</p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="primary-button"
                >
                  Explore menu
                </button>
              </div>
            ) : (
              <>
          <div className="cart-items">
  {cart.map((pizza, index) => (
    <div className="cart-item" key={`${pizza.id}-${index}`}>
      <img src={pizza.image} alt={pizza.name} />

      <div>
        <h3>{pizza.name}</h3>
        <span>
  ₹{pizza.price * (pizza.quantity || 1)}
</span>

        <div className="quantity-controls">
          <button
            onClick={() => decreaseQuantity(pizza.id)}
            aria-label={`Decrease ${pizza.name} quantity`}
          >
            −
          </button>

          <span>{pizza.quantity || 1}</span>

          <button
            onClick={() => increaseQuantity(pizza.id)}
            aria-label={`Increase ${pizza.name} quantity`}
          >
            +
          </button>
        </div>
      </div>

      <button onClick={() => removeFromCart(index)}>
        ×
      </button>
    </div>
  ))}
</div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>₹{cartTotal}</strong>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <strong>FREE</strong>
                  </div>

                  <div className="cart-total">
                    <span>Total</span>
                    <strong>₹{cartTotal}</strong>
                  </div>

                  <button
                    className="checkout-button"
  onClick={() => {
  setCartOpen(false);
  setCheckoutOpen(true);

  setTimeout(() => {
    document.querySelector(".checkout-page")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}}
                  >
                    Continue to checkout →
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
      {checkoutOpen && (
  <Checkout
    cart={cart}
    cartTotal={cartTotal}
    onBack={() => setCheckoutOpen(false)}
  />
)}
    </div>
  );
}

export default App;