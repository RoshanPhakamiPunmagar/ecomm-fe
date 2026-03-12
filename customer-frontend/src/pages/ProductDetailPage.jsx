import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { SERVER_URL } from "../services/api";
import { toast } from "react-toastify";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = !!localStorage.getItem("accessJWT");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.productId === product._id);

    if (existingItem) existingItem.quantity += 1;
    else
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: 1,
      });

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Product added to cart 🛒");
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.comment.trim() || review.rating === 0) {
      toast.error("Please provide rating and comment");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessJWT");
      if (!token) throw new Error("You must be logged in");

      const payload = {
        productId: id,
        rating: review.rating,
        comment: review.comment,
      };

      const res = await api.post("/reviews", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res?.data?.message || "Review submitted!");

      // Update UI locally
      setProduct((prev) => ({
        ...prev,
        reviews: [
          {
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date().toISOString(),
            user: { name: "You" },
          },
          ...(prev.reviews || []),
        ],
      }));

      setReview({ rating: 0, comment: "" });
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Star rating UI
  const renderStars = (currentRating, setRatingFn) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setRatingFn(i)}
          style={{
            cursor: "pointer",
            color: i <= currentRating ? "#ffc107" : "#e4e5e9",
            fontSize: "1.5rem",
          }}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  if (loading)
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (!product) return <div className="container mt-5">Product not found</div>;

  return (
    <div className="container mt-5">
      <Link to="/home" className="btn btn-link mb-3">
        ← Back to products
      </Link>

      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <img
              src={
                product.images?.length
                  ? `${SERVER_URL}/uploads/${product.images[0]}`
                  : "https://via.placeholder.com/500"
              }
              alt={product.name}
              className="img-fluid rounded"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <h3 className="text-success mb-3">${product.price}</h3>
          <p className="text-muted">{product.description}</p>
          <p>
            ⭐ {product.rating || 0} / 5
            <span className="text-muted ms-2">
              ({product.reviews?.length || 0} reviews)
            </span>
          </p>

          <button
            className="btn btn-primary btn-lg mt-3"
            onClick={handleAddToCart}
          >
            🛒 Add to Cart
          </button>

          <div className="mt-3">
            <Link to="/home" className="btn btn-outline-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5">
        <h4 className="mb-4">Customer Reviews</h4>
        {product.reviews?.length ? (
          product.reviews.map((rev, index) => (
            <div key={index} className="card p-3 mb-3 shadow-sm">
              <strong>{rev.user?.name || "User"}</strong>
              <p className="mb-1">{renderStars(rev.rating, () => {})}</p>
              <p className="text-muted">{rev.comment}</p>
              <small className="text-secondary">
                {new Date(rev.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Write Review */}
      {isLoggedIn && (
        <div className="mt-5">
          <h5>Write a Review</h5>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-3">
              <label>Rating</label>
              <div>
                {renderStars(review.rating, (r) =>
                  setReview({ ...review, rating: r }),
                )}
              </div>
            </div>
            <div className="mb-3">
              <label>Comment</label>
              <textarea
                className="form-control"
                rows="3"
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
              ></textarea>
            </div>
            <button
              className="btn btn-success"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {!isLoggedIn && (
        <div className="mt-4 text-muted">Please login to submit a review.</div>
      )}
    </div>
  );
}

export default ProductDetailPage;
