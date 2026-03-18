// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function ProductDetailPage() {
  const { id } = useParams();
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = !!localStorage.getItem("accessJWT");

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        if (data.images?.length) setSelectedImage(data.images[0]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Add to cart
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.productId === product._id);

    if (existing) existing.quantity += 1;
    else
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: 1,
      });

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart 🛒");
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.rating || !review.comment.trim()) {
      toast.error("Please provide rating and comment");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessJWT");
      const payload = {
        productId: id,
        rating: review.rating,
        comment: review.comment,
      };
      const res = await api.post("/reviews", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res?.data?.message);

      setProduct((prev) => ({
        ...prev,
        reviews: [
          {
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date(),
            user: { name: "You" },
          },
          ...(prev.reviews || []),
        ],
      }));

      setReview({ rating: 0, comment: "" });
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("You can only review products you purchased");
      } else {
        toast.error(err.response?.data?.message || "Failed to submit review");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Render stars
  const renderStars = (current, setRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setRating && setRating(i)}
          style={{
            cursor: setRating ? "pointer" : "default",
            color: i <= current ? "#ffc107" : "#ddd",
            fontSize: "1.4rem",
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
      <Link to="/home" className="btn btn-link mb-4">
        ← Back to Products
      </Link>

      <div className="row">
        {/* Image Section */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-3">
            <img
              src={
                selectedImage
                  ? `${SERVER_URL}/uploads/${selectedImage}`
                  : "https://via.placeholder.com/500"
              }
              alt={product.name}
              className="img-fluid rounded"
            />
          </div>

          <div className="d-flex gap-2 flex-wrap">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={`${SERVER_URL}/uploads/${img}`}
                alt="thumb"
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border:
                    selectedImage === img
                      ? "2px solid #0d6efd"
                      : "1px solid #ccc",
                  borderRadius: "5px",
                }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <h3 className="text-success">${product.price}</h3>

          <div className="mb-2">
            {renderStars(Math.round(product.rating || 0))}
            <span className="ms-2 text-muted">
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          <button
            className="btn btn-primary btn-lg mt-3"
            onClick={handleAddToCart}
          >
            🛒 Add to Cart
          </button>

          {/* Product Details */}
          <div className="mt-4">
            <h5 className="fw-bold">Product Details</h5>
            <hr />
            <p className="text-muted" style={{ lineHeight: "1.7" }}>
              {product.description || "No description available"}
            </p>

            <h6 className="fw-bold mt-3">Additional Information</h6>
            <ul className="text-muted">
              <li>Product ID: {product._id}</li>
              <li>Category: {product.category || "General Product"}</li>
              <li>Available Stock: {product.stock || "In Stock"}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Write Review */}
      {isLoggedIn && (
        <div className="mt-5">
          <h5>Write a Review</h5>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-3">
              <label className="form-label">Rating</label>
              <div>
                {renderStars(review.rating, (r) =>
                  setReview({ ...review, rating: r }),
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Comment</label>
              <textarea
                className="form-control"
                rows="3"
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
              />
            </div>

            <button className="btn btn-success" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {!isLoggedIn && (
        <div className="mt-4 text-muted">Please buy to submit a review.</div>
      )}
    </div>
  );
}

export default ProductDetailPage;
