import React, { useEffect, useState } from "react";
import api from "../services/api";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders");

        if (res.data?.status === "success") {
          setOrders(res.data.orders);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5 text-center text-danger">{error}</div>
    );

  if (!orders.length)
    return (
      <div className="container mt-5 text-center">
        <h4>No orders found 🛒</h4>
        <p className="text-muted">Start shopping to see your orders here.</p>
      </div>
    );

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="card shadow-sm mb-4">
          <div className="card-body">
            {/* Order Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="mb-1">Order ID</h6>
                <small className="text-muted">{order._id}</small>
              </div>

              <span className="badge bg-success">{order.status}</span>
            </div>

            {/* Order Info */}
            <div className="row mb-3">
              <div className="col-md-4">
                <strong>Total</strong>
                <p className="text-success">
                  ${Number(order.totalAmount || 0).toFixed(2)}
                </p>
              </div>

              <div className="col-md-4">
                <strong>Date</strong>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Products */}
            <div>
              <strong>Products</strong>

              {order.products.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between border-bottom py-2"
                >
                  <div>
                    {item.name}
                    <small className="text-muted"> x {item.quantity}</small>
                  </div>

                  <div>
                    $
                    {(
                      (Number(item.price) || 0) * (Number(item.quantity) || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderHistoryPage;
