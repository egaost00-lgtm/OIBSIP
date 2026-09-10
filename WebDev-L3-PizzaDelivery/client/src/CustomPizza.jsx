import { useMemo, useState } from "react";

const bases = [
  { name: "Classic Thin", price: 0 },
  { name: "Italian Hand-Stretched", price: 40 },
  { name: "Cheese Burst", price: 80 },
  { name: "Whole Wheat", price: 50 },
  { name: "Gluten Free", price: 100 },
];

const sauces = [
  { name: "Classic Tomato", price: 0 },
  { name: "Spicy Arrabbiata", price: 20 },
  { name: "Garlic Cream", price: 30 },
  { name: "BBQ Sauce", price: 25 },
  { name: "Pesto", price: 35 },
];

const cheeses = [
  { name: "Mozzarella", price: 0 },
  { name: "Cheddar", price: 30 },
  { name: "Parmesan", price: 40 },
  { name: "Four Cheese Blend", price: 60 },
];

const vegetables = [
  { name: "Mushroom", price: 20 },
  { name: "Bell Pepper", price: 15 },
  { name: "Red Onion", price: 15 },
  { name: "Olives", price: 20 },
  { name: "Jalapeño", price: 15 },
  { name: "Sweet Corn", price: 20 },
];

function CustomPizza({ onBack, onAddToCart }) {
  const [base, setBase] = useState(bases[0]);
  const [sauce, setSauce] = useState(sauces[0]);
  const [cheese, setCheese] = useState(cheeses[0]);
  const [selectedVegetables, setSelectedVegetables] = useState([]);

  const total = useMemo(() => {
    const vegetablesTotal = selectedVegetables.reduce(
      (sum, vegetable) => sum + vegetable.price,
      0
    );

    return 399 + base.price + sauce.price + cheese.price + vegetablesTotal;
  }, [base, sauce, cheese, selectedVegetables]);

  const toggleVegetable = (vegetable) => {
    setSelectedVegetables((current) => {
      const exists = current.some(
        (item) => item.name === vegetable.name
      );

      if (exists) {
        return current.filter(
          (item) => item.name !== vegetable.name
        );
      }

      return [...current, vegetable];
    });
  };

  const handleAddToCart = () => {
    const customPizza = {
      id: `custom-${Date.now()}`,
      name: "Custom Pizza",
      category: "Custom",
      description: `${base.name} base • ${sauce.name} • ${cheese.name}`,
      price: total,
      rating: 5,
      reviews: 0,
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=90",
      quantity: 1,
      customizations: {
        base: base.name,
        sauce: sauce.name,
        cheese: cheese.name,
        vegetables: selectedVegetables.map(
          (vegetable) => vegetable.name
        ),
      },
    };

    onAddToCart(customPizza);
  };

  return (
    <div className="custom-pizza-page">
      <div className="custom-pizza-header">
        <button
          type="button"
          className="location-button"
          onClick={onBack}
        >
          ← Back to Menu
        </button>

        <div>
          <span className="section-label">BUILD YOUR OWN</span>
          <h1>Custom Pizza</h1>
          <p>
            Create your perfect pizza from the base up.
          </p>
        </div>
      </div>

      <div className="custom-pizza-layout">
        <div className="custom-pizza-options">
          <section className="builder-section">
            <span className="section-label">STEP 1</span>
            <h2>Choose your base</h2>

            <div className="builder-options">
              {bases.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className={
                    base.name === item.name
                      ? "builder-option active"
                      : "builder-option"
                  }
                  onClick={() => setBase(item)}
                >
                  <strong>{item.name}</strong>
                  <span>
                    {item.price === 0
                      ? "Included"
                      : `+₹${item.price}`}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="builder-section">
            <span className="section-label">STEP 2</span>
            <h2>Choose your sauce</h2>

            <div className="builder-options">
              {sauces.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className={
                    sauce.name === item.name
                      ? "builder-option active"
                      : "builder-option"
                  }
                  onClick={() => setSauce(item)}
                >
                  <strong>{item.name}</strong>
                  <span>
                    {item.price === 0
                      ? "Included"
                      : `+₹${item.price}`}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="builder-section">
            <span className="section-label">STEP 3</span>
            <h2>Choose your cheese</h2>

            <div className="builder-options">
              {cheeses.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className={
                    cheese.name === item.name
                      ? "builder-option active"
                      : "builder-option"
                  }
                  onClick={() => setCheese(item)}
                >
                  <strong>{item.name}</strong>
                  <span>
                    {item.price === 0
                      ? "Included"
                      : `+₹${item.price}`}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="builder-section">
            <span className="section-label">STEP 4</span>
            <h2>Pick your vegetables</h2>

            <div className="builder-options">
              {vegetables.map((item) => {
                const selected = selectedVegetables.some(
                  (vegetable) =>
                    vegetable.name === item.name
                );

                return (
                  <button
                    type="button"
                    key={item.name}
                    className={
                      selected
                        ? "builder-option active"
                        : "builder-option"
                    }
                    onClick={() =>
                      toggleVegetable(item)
                    }
                  >
                    <strong>
                      {selected ? "✓ " : ""}
                      {item.name}
                    </strong>

                    <span>+₹{item.price}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="custom-pizza-summary">
          <span className="section-label">
            YOUR CREATION
          </span>

          <div className="custom-pizza-icon">🍕</div>

          <h2>Custom Pizza</h2>

          <div className="summary-row">
            <span>Base</span>
            <strong>{base.name}</strong>
          </div>

          <div className="summary-row">
            <span>Sauce</span>
            <strong>{sauce.name}</strong>
          </div>

          <div className="summary-row">
            <span>Cheese</span>
            <strong>{cheese.name}</strong>
          </div>

          <div className="summary-row">
            <span>Vegetables</span>
            <strong>
              {selectedVegetables.length === 0
                ? "None"
                : selectedVegetables
                    .map((item) => item.name)
                    .join(", ")}
            </strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            type="button"
            className="checkout-button"
            onClick={handleAddToCart}
          >
            Add Custom Pizza →
          </button>
        </aside>
      </div>
    </div>
  );
}

export default CustomPizza;