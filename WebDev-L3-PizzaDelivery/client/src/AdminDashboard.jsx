import { useEffect, useState } from "react";

function AdminDashboard({ admin, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inventory, setInventory] = useState([]);
const [inventoryLoading, setInventoryLoading] = useState(true);
const [inventoryError, setInventoryError] = useState("");

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/admin/orders"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load orders."
        );
      }

      setOrders(data.orders || []);
      setError("");
    } catch (err) {
      console.error("Admin orders fetch failed:", err);
      setError(
        err.message || "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/admin/inventory"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load inventory."
        );
      }

      setInventory(data.inventory || []);
      setInventoryError("");
    } catch (err) {
      console.error(
        "Admin inventory fetch failed:",
        err
      );

      setInventoryError(
        err.message || "Unable to load inventory."
      );
    } finally {
      setInventoryLoading(false);
    }
  };

  fetchOrders();
  fetchInventory();
}, []);

  return (
    <div className="auth-page">
      <div
        className="auth-card"
        style={{ maxWidth: "900px", width: "95%" }}
      >
        <div className="auth-logo">
          <span>🍕</span>
          <h1>Crust & Co.</h1>
        </div>

        <p className="auth-subtitle">
          Admin Dashboard
        </p>

        <p>
          Logged in as: <strong>{admin?.email}</strong>
        </p>

        <hr />

        <h2>Orders</h2>

        {loading && <p>Loading orders...</p>}

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {!loading && !error && orders.length === 0 && (
          <p>No orders found.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "16px",
                  marginTop: "16px",
                  textAlign: "left",
                }}
                
              >
                <h3>
                  Order #{order._id}
                </h3>

                <p>
                  <strong>Status:</strong>{" "}
                  {order.status || "Pending"}
                </p>

                <p>
                  <strong>Total:</strong> ₹
                  {order.total}
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {order.paymentMethod}
                </p>

                <p>
                  <strong>Items:</strong>{" "}
                  {order.items?.length || 0}
                </p>
                <select
  value={order.status || "Pending"}
  onChange={async (event) => {
    const newStatus = event.target.value;

    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/orders/${order._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update status."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder._id === order._id
            ? {
                ...currentOrder,
                status: newStatus,
              }
            : currentOrder
        )
      );
    } catch (err) {
      console.error(
        "Order status update failed:",
        err
      );

      alert(
        err.message ||
          "Unable to update order status."
      );
    }
  }}
>
  <option value="Pending">Pending</option>
  <option value="Confirmed">Confirmed</option>
  <option value="Preparing">Preparing</option>
  <option value="Out for Delivery">
    Out for Delivery
  </option>
  <option value="Delivered">Delivered</option>
</select>
              </div>
            ))}
          </div>
        )}
                {/* INVENTORY */}
       <div style={{ marginTop: "40px" }}>
  <h2>Inventory</h2>

  {inventoryLoading && (
    <p>Loading inventory...</p>
  )}

  {inventoryError && (
    <p style={{ color: "red" }}>
      {inventoryError}
    </p>
  )}

  {!inventoryLoading &&
    !inventoryError &&
    inventory.length > 0 && (
      <div>
        {inventory.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              marginTop: "12px",
              textAlign: "left",
            }}
          >
            <h3>{item.name}</h3>

            <p>
              <strong>Stock:</strong>{" "}
              {item.stock}
            </p>

            <p>
              <strong>Low-stock threshold:</strong>{" "}
              {item.lowStockThreshold}
            </p>
            <div style={{ marginTop: "12px" }}>
  <input
    type="number"
    min="0"
    value={item.stock}
    onChange={(event) => {
      const newStock = Number(event.target.value);

      setInventory((currentInventory) =>
        currentInventory.map((currentItem) =>
          currentItem._id === item._id
            ? {
                ...currentItem,
                stock: newStock,
              }
            : currentItem
        )
      );
    }}
    style={{
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      width: "120px",
      marginRight: "8px",
    }}
  />

  <button
    type="button"
    onClick={async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/admin/inventory/${item._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stock: item.stock,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to update stock."
          );
        }

        alert("Stock updated successfully.");
      } catch (err) {
        console.error(
          "Inventory update failed:",
          err
        );

        alert(
          err.message ||
            "Unable to update inventory."
        );
      }
    }}
    style={{
      padding: "8px 12px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    }}
  >
    Update Stock
  </button>
</div>
          </div>
        ))}
      </div>
    )}
</div>

        <button
          className="auth-submit"
          onClick={onLogout}
          style={{ marginTop: "24px" }}
        >
          Admin Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;