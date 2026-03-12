import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import SignupPage from "./pages/SignupPage.jsx";
import SignupSuccessPage from "./pages/SignupSuccessPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Home from "./pages/Home.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
// Components
import Navbar from "./components/Navbar.js";
import OrderSummary from "./components/OrderSummary.js";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* Auth */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup-success" element={<SignupSuccessPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
