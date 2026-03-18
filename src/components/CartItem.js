import React from "react";

const SERVER_URL = "http://localhost:3000";

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="d-flex align-items-center mb-3 p-3 rounded shadow-sm border hover-shadow transition">
      {/* Product Image */}
      <img
        src={
          item.image
            ? `${SERVER_URL}/uploads/${item.image}`
            : "https://via.placeholder.com/100"
        }
        alt={item.name}
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          borderRadius: "10px",
          marginRight: "1rem",
        }}
      />

      {/* Product Info */}
      <div className="flex-grow-1">
        <h6 className="mb-1 fw-bold">{item.name}</h6>
        <p className="mb-2 text-muted">
          ${Number(item.price || 0).toFixed(2)} x {item.quantity} = $
          {((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(
            2,
          )}
        </p>

        {/* Quantity & Remove Controls */}
        <div className="d-flex align-items-center">
          <button
            className="btn btn-sm btn-outline-primary me-2 rounded-circle px-2"
            onClick={onDecrease}
          >
            -
          </button>
          <span className="px-2">{item.quantity}</span>
          <button
            className="btn btn-sm btn-outline-primary ms-2 rounded-circle px-2"
            onClick={onIncrease}
          >
            +
          </button>
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
