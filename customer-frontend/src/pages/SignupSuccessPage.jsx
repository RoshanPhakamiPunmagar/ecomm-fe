import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SignupSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "#f0f4f8" }}
    >
      <div
        className="card shadow-lg p-5 text-center"
        style={{ width: "400px" }}
      >
        <h2>Signup Successful!</h2>
        <p>
          A verification email has been sent to <strong>{email}</strong>. <br />
          Please check your inbox and follow the instructions to activate your
          account.
        </p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SignupSuccessPage;
