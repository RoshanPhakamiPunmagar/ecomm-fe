// src/pages/CartPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import { toast } from "react-toastify";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [lastItemMessage, setLastItemMessage] = useState(false);
  const [actionType, setActionType] = useState(""); // "decrease" or "remove"

  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const increaseQty = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
    setCartItems(updatedCart);
  };

  // Handle decrease (-) button click
  const handleDecreaseClick = (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;

    setProductToUpdate(productId);
    setLastItemMessage(item.quantity === 1);
    setActionType("decrease");
    setShowConfirm(true);
  };

  // Handle remove button click
  const handleRemoveClick = (productId) => {
    setProductToUpdate(productId);
    setLastItemMessage(false);
    setActionType("remove");
    setShowConfirm(true);
  };

  // Confirm modal action
  const confirmAction = () => {
    if (!productToUpdate) return;

    if (actionType === "decrease") {
      // decrease 1 quantity
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.productId === productToUpdate
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
      toast.success("Quantity decreased by 1");
    }

    if (actionType === "remove") {
      // decrease 1 quantity only
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.productId === productToUpdate
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
      toast.success("Removed 1 quantity from cart");
    }

    setShowConfirm(false);
    setProductToUpdate(null);
    setLastItemMessage(false);
    setActionType("");
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast.success("Order placed successfully!");
  };

  const totalAmountCents = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity * 100,
    0,
  );

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/home">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Cart
          </li>
        </ol>
      </nav>

      <div className="mb-3">
        <Link to="/home" className="btn btn-outline-primary">
          ← Continue Shopping
        </Link>
      </div>

      <h2 className="mb-4">My Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center mt-5">
          <h4>Your cart is empty 🛒</h4>
          <p className="text-muted">Add products to cart to see them here.</p>
          <Link to="/home" className="btn btn-primary mt-3">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8 mb-4">
            <div className="card p-3 shadow-sm">
              <h5 className="mb-3">Cart Items</h5>
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onIncrease={() => increaseQty(item.productId)}
                  onDecrease={() => handleDecreaseClick(item.productId)}
                  onRemove={() => handleRemoveClick(item.productId)}
                />
              ))}
            </div>
          </div>

          <div className="col-md-4">
            <OrderSummary
              cartItems={cartItems}
              onOrderSuccess={handleOrderSuccess}
            />
            <button
              className="btn btn-success w-100 mt-3"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
            <p className="text-muted mt-2">
              Total: ${(totalAmountCents / 100).toFixed(2)} AUD
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Action</h5>
              </div>
              <div className="modal-body">
                <p>
                  {lastItemMessage
                    ? "This is the last one of this product. Are you sure you want to remove 1 quantity from the cart?"
                    : actionType === "decrease"
                      ? "Are you sure you want to decrease 1 quantity?"
                      : "Are you sure you want to remove 1 quantity from the cart?"}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  No
                </button>
                <button className="btn btn-danger" onClick={confirmAction}>
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
