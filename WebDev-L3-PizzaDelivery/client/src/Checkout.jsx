import { useState } from "react";

function Checkout({ cart, cartTotal, onBack, onTrackOrder }) {
  const [orderPlaced, setOrderPlaced] = useState(false);
const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    const fields = document.querySelectorAll(
      ".checkout-details input, .checkout-details textarea"
    );

    const emptyField = [...fields].find(
      (field) => !field.value.trim()
    );

    if (emptyField) {
      alert(
        "Please fill in all delivery details before placing your order."
      );
      emptyField.focus();
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderData = {
      items: cart,
      total: cartTotal,
      paymentMethod,
    };

    setLoading(true);

    // =========================
    // CASH ON DELIVERY
    // =========================
    if (paymentMethod === "cash") {
      try {
        const response = await fetch(
          "http://localhost:5001/api/orders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Order could not be saved"
          );
        }

        console.log("COD order saved:", data);

        setOrderPlaced(true);
      } catch (error) {
        console.error("COD order save failed:", error);

        alert(
          error.message ||
            "Something went wrong while placing your order."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // =========================
    // RAZORPAY CARD / UPI
    // =========================
    try {
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay checkout could not be loaded. Please refresh the page and try again."
        );
      }

      // Create Razorpay order on backend
      const response = await fetch(
        "http://localhost:5001/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: cartTotal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create Razorpay payment order."
        );
      }

      const razorpayOrder = data.order;

      console.log(
        "Razorpay order created:",
        razorpayOrder
      );

      // IMPORTANT:
      // Replace this with your Razorpay TEST Key ID.
      // Never put the Key Secret here.
      const razorpayKeyId =
        "rzp_live_TaIZDWSYgSHYdx";

      const options = {
        key: razorpayKeyId,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Crust & Co.",

        description: "Crust & Co. Pizza Order",

        order_id: razorpayOrder.id,

        handler: async function (paymentResponse) {
          console.log(
            "Razorpay payment successful:",
            paymentResponse
          );

          try {
            // Save the paid order in MongoDB
            const saveResponse = await fetch(
              "http://localhost:5001/api/orders",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...orderData,

                  razorpayPaymentId:
                    paymentResponse.razorpay_payment_id,

                  razorpayOrderId:
                    paymentResponse.razorpay_order_id,

                  razorpaySignature:
                    paymentResponse.razorpay_signature,

                  paymentStatus: "paid",
                }),
              }
            );

            const savedOrder =
              await saveResponse.json();

           if (!saveResponse.ok) {
  throw new Error(
    savedOrder.message ||
      "Paid order could not be saved."
  );
}

console.log(
  "Verified paid order saved:",
  savedOrder
);

setTrackingOrderId(savedOrder.orderId);
if (onTrackOrder) {
  onTrackOrder(savedOrder.orderId);
}
          } catch (error) {
            console.error(
              "Paid order save failed:",
              error
            );

            alert(
              "Payment succeeded, but we could not save the order."
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay checkout closed by customer."
            );

            setLoading(false);
          },
        },

        theme: {
          color: "#d92d20",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response.error
          );

          alert(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay checkout failed:",
        error
      );

      alert(
        error.message ||
          "Something went wrong with Razorpay checkout."
      );

      setLoading(false);
    }
  };

  // =========================
  // ORDER SUCCESS SCREEN
  // =========================
  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">✓</div>

            <span className="section-label">
              ORDER CONFIRMED
            </span>

            <h1>
              Your pizza is on the way! 🍕
            </h1>

            <p>
              Thanks for ordering from Crust & Co. Your
              order has been confirmed and our kitchen is
              getting started.
            </p>

            <div className="success-details">
              <div>
                <span>Order total</span>
                <strong>₹{cartTotal}</strong>
              </div>

              <div>
                <span>Estimated delivery</span>
                <strong>25–35 min</strong>
              </div>
            </div>

            <button
              className="primary-button"
              onClick={onBack}
            >
              Back to home →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* CHECKOUT HEADER */}
      <header className="checkout-header">
        <button
          className="checkout-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="checkout-brand">
          <span>🍕</span>
          Crust & Co.
        </div>

        <div className="secure-checkout">
          🔒 Secure checkout
        </div>
      </header>

      <main className="checkout-main">
        {/* TITLE */}
        <div className="checkout-title">
          <span className="section-label">
            CHECKOUT
          </span>

          <h1>Complete your order.</h1>

          <p>
            Fresh pizza is almost at your doorstep. Just a
            few details and you're ready to go.
          </p>
        </div>

        <div className="checkout-layout">
          {/* LEFT SIDE */}
          <section className="checkout-details">
            {/* DELIVERY DETAILS */}
            <div className="checkout-card">
              <div className="checkout-card-heading">
                <div>
                  <span>01</span>
                  <h2>Delivery details</h2>
                </div>

                <small>
                  Where should we deliver?
                </small>
              </div>

              <div className="form-grid">
                <div className="form-field full">
                  <label>Full name</label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-field">
                  <label>Phone number</label>

                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-field">
                  <label>Email address</label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="form-field full">
                  <label>Delivery address</label>

                  <textarea
                    rows="3"
                    placeholder="House / Flat number, street, area"
                  />
                </div>

                <div className="form-field">
                  <label>City</label>

                  <input
                    type="text"
                    placeholder="Your city"
                  />
                </div>

                <div className="form-field">
                  <label>PIN code</label>

                  <input
                    type="text"
                    placeholder="000000"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="checkout-card">
              <div className="checkout-card-heading">
                <div>
                  <span>02</span>
                  <h2>Payment method</h2>
                </div>

                <small>
                  Choose how you'd like to pay
                </small>
              </div>

              <div className="payment-options">
                <button
                  type="button"
                  className={
                    paymentMethod === "card"
                      ? "payment-option active"
                      : "payment-option"
                  }
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                >
                  <span className="payment-icon">
                    💳
                  </span>

                  <div>
                    <strong>Card / UPI</strong>

                    <small>
                      Secure online payment
                    </small>
                  </div>

                  {paymentMethod === "card" ? (
                    <span className="payment-check">
                      ✓
                    </span>
                  ) : (
                    <span className="payment-radio" />
                  )}
                </button>

                <button
                  type="button"
                  className={
                    paymentMethod === "cash"
                      ? "payment-option active"
                      : "payment-option"
                  }
                  onClick={() =>
                    setPaymentMethod("cash")
                  }
                >
                  <span className="payment-icon">
                    💵
                  </span>

                  <div>
                    <strong>
                      Cash on delivery
                    </strong>

                    <small>
                      Pay when your pizza arrives
                    </small>
                  </div>

                  {paymentMethod === "cash" ? (
                    <span className="payment-check">
                      ✓
                    </span>
                  ) : (
                    <span className="payment-radio" />
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <aside className="checkout-order">
            <div className="order-card">
              <div className="order-card-heading">
                <div>
                  <span className="section-label">
                    YOUR ORDER
                  </span>

                  <h2>Order summary</h2>
                </div>

                <span className="order-count">
                  {cart.reduce(
                    (total, pizza) =>
                      total +
                      (pizza.quantity || 1),
                    0
                  )}{" "}
                  item
                  {cart.reduce(
                    (total, pizza) =>
                      total +
                      (pizza.quantity || 1),
                    0
                  ) !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              {/* PRODUCTS */}
              <div className="checkout-products">
                {cart.map((pizza, index) => (
                  <div
                    className="checkout-product"
                    key={`${pizza.id}-${index}`}
                  >
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                    />

                    <div className="checkout-product-info">
                      <h3>{pizza.name}</h3>

                      <span>
                        {pizza.category}
                      </span>
                    </div>

                    <strong>
                      ₹
                      {pizza.price *
                        (pizza.quantity || 1)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-divider" />

              {/* PRICES */}
              <div className="price-row">
                <span>Subtotal</span>

                <strong>
                  ₹{cartTotal}
                </strong>
              </div>

              <div className="price-row">
                <span>Delivery</span>

                <strong className="free">
                  FREE
                </strong>
              </div>

              <div className="total-row">
                <span>Total</span>

                <strong>
                  ₹{cartTotal}
                </strong>
              </div>

              {/* PLACE ORDER */}
              <button
                type="button"
                className="place-order-button"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading
                  ? paymentMethod === "card"
                    ? "Opening secure payment..."
                    : "Placing order..."
                  : "Place order"}

                {!loading && <span>→</span>}
              </button>

              <div className="checkout-trust">
                🔒 Your information is protected
              </div>
            </div>

            {/* DELIVERY ESTIMATE */}
            <div className="delivery-estimate">
              <span>⚡</span>

              <div>
                <strong>
                  Estimated delivery
                </strong>

                <small>
                  25–35 minutes after confirmation
                </small>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Checkout;