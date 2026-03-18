import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const SERVER_URL = "http://localhost:3000";

function ProductCard({ product }) {
  const imageUrl =
    product.images && product.images.length > 0
      ? `${SERVER_URL}/uploads/${product.images[0]}`
      : "https://via.placeholder.com/200";

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  };

  return (
    <div className="card h-100 shadow-sm rounded hover-lift">
      <img
        src={imageUrl}
        className="card-img-top rounded-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted flex-grow-1">
          {product.description?.slice(0, 80)}...
        </p>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="text-primary fw-bold mb-0">${product.price}</h6>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>

        <Link
          to={`/product/${product._id}`}
          className="btn btn-outline-primary btn-sm mt-2"
        >
          View Details
        </Link>
      </div>

      {/* Hover effect */}
      <style>
        {`
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}

export default ProductCard;
