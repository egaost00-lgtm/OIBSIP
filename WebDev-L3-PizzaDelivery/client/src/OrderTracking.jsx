import { useEffect, useState } from "react";

function OrderTracking({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statuses = [
    {
      key: "Pending",
      label: "Order received",
      icon: "📝",
    },
    {
      key: "Confirmed",
      label: "Order confirmed",
      icon: "✓",
    },
    {
      key: "Preparing",
      label: "Pizza is being prepared",
      icon: "🍕",
    },
    {
      key: "Out for Delivery",
      label: "Out for delivery",
      icon: "🛵",
    },
    {
      key: "Delivered",
      label: "Delivered",
      icon: "🎉",
    },
  ];

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/orders/${orderId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load order."
          );
        }

        if (isMounted) {
          setOrder(data.order);
          setError("");
          setLoading(false);
        }
      } catch (err) {
        console.error(
          "Order tracking failed:",
          err
        );

        if (isMounted) {
          setError(
            err.message ||
              "Unable to load order tracking."
          );
          setLoading(false);
        }
      }
    };

    fetchOrder();

    // Check for status updates every 5 seconds
    const interval = setInterval(
      fetchOrder,
      5000
    );

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">🍕</div>

            <span className="section-label">
              ORDER TRACKING
            </span>

            <h1>
              Loading your order...
            </h1>

            <p>
              We're getting the latest update from
              the kitchen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">!</div>

            <span className="section-label">
              ORDER TRACKING
            </span>

            <h1>
              Couldn't load your order.
            </h1>

            <p>{error}</p>

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

  const currentStatus =
    order?.status || "Pending";

  const currentIndex =
    statuses.findIndex(
      (status) =>
        status.key === currentStatus
    );

  return (
    <div className="checkout-page">
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
          🔒 Live order tracking
        </div>
      </header>

      <main className="checkout-main">
        <div className="checkout-title">
          <span className="section-label">
            ORDER TRACKING
          </span>

          <h1>
            {currentStatus === "Delivered"
              ? "Your pizza has arrived! 🎉"
              : "Your pizza is on the way! 🍕"}
          </h1>

          <p>
            Order #{orderId}
          </p>
        </div>

        <div className="checkout-layout">
          {/* TRACKING */}
          <section className="checkout-details">
            <div className="checkout-card">
              <div className="checkout-card-heading">
                <div>
                  <span>01</span>

                  <h2>
                    Order status
                  </h2>
                </div>

                <small>
                  Updates automatically
                </small>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  marginTop: "24px",
                }}
              >
                {statuses.map(
                  (status, index) => {
                    const completed =
                      currentIndex >= index;

                    const active =
                      currentIndex === index;

                    return (
                      <div
                        key={status.key}
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "16px",
                          padding: "16px",
                          borderRadius: "14px",
                          border: active
                            ? "2px solid #d92d20"
                            : "1px solid #e5e5e5",
                          background:
                            active
                              ? "#fff7f5"
                              : completed
                              ? "#fafafa"
                              : "#ffffff",
                        }}
                      >
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius:
                              "50%",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              completed
                                ? "#d92d20"
                                : "#eeeeee",
                            color:
                              completed
                                ? "#ffffff"
                                : "#777777",
                            fontSize: "20px",
                            flexShrink: 0,
                          }}
                        >
                          {status.icon}
                        </div>

                        <div>
                          <strong>
                            {status.label}
                          </strong>

                          <div
                            style={{
                              marginTop:
                                "4px",
                              fontSize:
                                "13px",
                              color:
                                "#777",
                            }}
                          >
                            {active
                              ? "Current status"
                              : completed
                              ? "Completed"
                              : "Coming next"}
                          </div>
                        </div>

                        {active && (
                          <span
                            style={{
                              marginLeft:
                                "auto",
                              fontSize:
                                "12px",
                              fontWeight:
                                "700",
                              color:
                                "#d92d20",
                            }}
                          >
                            LIVE
                          </span>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </section>

          {/* ORDER SUMMARY */}
          <aside className="checkout-order">
            <div className="order-card">
              <div className="order-card-heading">
                <div>
                  <span className="section-label">
                    YOUR ORDER
                  </span>

                  <h2>
                    Order summary
                  </h2>
                </div>
              </div>

              <div className="checkout-products">
                {order?.items?.map(
                  (pizza, index) => (
                    <div
                      className="checkout-product"
                      key={`${pizza.id}-${index}`}
                    >
                      <img
                        src={pizza.image}
                        alt={pizza.name}
                      />

                      <div className="checkout-product-info">
                        <h3>
                          {pizza.name}
                        </h3>

                        <span>
                          {pizza.category}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {pizza.price *
                          (pizza.quantity ||
                            1)}
                      </strong>
                    </div>
                  )
                )}
              </div>

              <div className="order-divider" />

              <div className="price-row">
                <span>
                  Total
                </span>

                <strong>
                  ₹{order?.total}
                </strong>
              </div>

              <div className="delivery-estimate">
                <span>⚡</span>

                <div>
                  <strong>
                    Estimated delivery
                  </strong>

                  <small>
                    25–35 minutes
                  </small>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default OrderTracking;