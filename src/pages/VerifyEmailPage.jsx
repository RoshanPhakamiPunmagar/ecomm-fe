import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState("loading"); // loading | success | failed
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("failed");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await api.post("/api/customer/v1/auth/verify", { token });
        setStatus(res.data.status === "success" ? "success" : "failed");
      } catch {
        setStatus("failed");
      }
    };

    verifyEmail();
  }, [token]);

  if (status === "loading")
    return <p className="text-center mt-5">Verifying your email...</p>;

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        className="card p-4 text-center shadow"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        {status === "success" ? (
          <>
            <h3>Email Verified!</h3>
            <p>
              Your account has been successfully verified. You can now login.
            </p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <h3>Verification Failed</h3>
            <p>The verification link is invalid or expired.</p>
            <button
              className="btn btn-danger mt-3"
              onClick={() => navigate("/signup")}
            >
              Retry Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
