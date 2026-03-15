// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { SERVER_URL } from "../services/api";
import { toast } from "react-toastify";

function ProductDetailPage() {
  const { id } = useParams();

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
        const res = await api.get(`/products/${id}`);
        const data = res.data.product;

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

  // Dynamic product description
  const getProductDescription = (product) => {
    if (!product) return "";
    switch (product.name) {
      case "Sony WH-1000XM5":
        return "Experience world-class noise cancellation and immersive sound with the Sony WH-1000XM5 headphones. Perfect for music lovers and frequent travelers.";
      case "Google Pixel 8":
        return "The Google Pixel 8 features a powerful Tensor G3 chip, amazing AI camera, and smooth Android experience for productivity and creativity.";
      case "Dell XPS 13":
        return "Dell XPS 13 combines sleek design with high performance, featuring a stunning InfinityEdge display and powerful Intel processor.";
      case "MacBook Air M2":
        return "Apple MacBook Air M2 offers incredible performance with the M2 chip, all-day battery life, and a lightweight design for ultimate portability.";
      case "Samsung Galaxy S23":
        return "Samsung Galaxy S23 delivers a premium smartphone experience with a high-refresh AMOLED display, versatile camera system, and fast performance.";
      default:
        return (
          product.description ||
          `${product.name} is a high-quality product for everyday use and great value.`
        );
    }
  };

  // Dynamic key features
  const getKeyFeatures = (product) => {
    if (!product) return [];
    switch (product.name) {
      case "Sony WH-1000XM5":
        return [
          "Industry-leading noise cancellation",
          "30 hours battery life",
          "Adaptive Sound Control",
          "Touch sensor controls",
          "Premium lightweight design",
        ];
      case "Google Pixel 8":
        return [
          "Google Tensor G3 processor",
          "AI-powered camera system",
          "6.2” OLED display",
          "Android 14 with updates",
          "Adaptive battery management",
        ];
      case "Dell XPS 13":
        return [
          "13.4” InfinityEdge display",
          "12th Gen Intel Core i7 processor",
          "Lightweight aluminum chassis",
          "Up to 16GB RAM with SSD",
          "Long battery life with quick charge",
        ];
      case "MacBook Air M2":
        return [
          "Apple M2 chip 8-core CPU",
          "Retina display with True Tone",
          "Fanless silent design",
          "Up to 18 hours battery life",
          "Ultra-slim and portable",
        ];
      case "Samsung Galaxy S23":
        return [
          "6.1” Dynamic AMOLED 2X display",
          "Triple-lens camera system",
          "Snapdragon 8 Gen 2 processor",
          "Fast and wireless charging",
          "IP68 water & dust resistance",
        ];
      default:
        return [
          "High-quality materials",
          "Modern and reliable design",
          "Comfortable and durable",
          "Great performance and value",
          "Suitable for daily use",
        ];
    }
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
              {getProductDescription(product)}
            </p>

            <h6 className="fw-bold mt-3">Key Features</h6>
            <ul className="text-muted">
              {getKeyFeatures(product).map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

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
