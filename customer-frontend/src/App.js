// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Home from "./pages/Home.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";

// Components
import Navbar from "./components/Navbar.js";
import OrderSummary from "./components/OrderSummary.js";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route
          path="/verify-email/:token"
          element={<EmailVerificationPage />}
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
