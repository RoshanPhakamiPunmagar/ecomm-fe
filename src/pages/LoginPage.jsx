import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      console.log("LOGIN RESPONSE:", res.data); // 👈 add this

      localStorage.setItem("accessJWT", res.data.tokens.accessJWT);
      localStorage.setItem("refreshJWT", res.data.tokens.refreshJWT);

      toast.success("Login successful");

      navigate("/home");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg,#667eea,#764ba2)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "400px",
          borderRadius: "15px",
        }}
      >
        <h3 className="text-center mb-4">Welcome Back</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <label>Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              className="form-control"
              onChange={handleChange}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#667eea" }}
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
