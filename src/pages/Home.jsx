import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/global.css";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 8, // Optional: number of products per page
  });

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Only send filters that have a value
      const params = {};
      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== "" &&
          filters[key] !== null &&
          filters[key] !== undefined
        ) {
          params[key] = filters[key];
        }
      });

      const { data } = await api.get("/products", { params });

      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // reset to first page on filter change
    }));
  };

  const handleSort = (e) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: "price",
      order: e.target.value,
      page: 1,
    }));
  };

  const changePage = (pageNumber) => {
    setFilters((prev) => ({
      ...prev,
      page: pageNumber,
    }));
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Discover Products</h2>
        <p className="text-muted">Find the best products at the best prices</p>
      </div>

      {/* Filters */}
      <div className="card shadow-sm p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search products..."
              name="search"
              value={filters.search}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min Price"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Max Price"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.order}
              onChange={handleSort}
            >
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5 text-muted">No products found</div>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination?.pages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {[...Array(pagination.pages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    pagination.page === pageNumber ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => changePage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Home;
