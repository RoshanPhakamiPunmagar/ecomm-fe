import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

export default function CheckoutPage() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initStripe = async () => {
      try {
        const token = localStorage.getItem("accessJWT");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        // Load Stripe publishable key
        const configRes = await fetch("http://localhost:3000/payment/config");
        if (!configRes.ok) throw new Error("Failed to load Stripe config");
        const { publishableKey } = await configRes.json();

        const stripe = await loadStripe(publishableKey);
        setStripePromise(stripe);

        // Create PaymentIntent
        const intentRes = await fetch("http://localhost:3000/payment/intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: 120000 }),
        });

        const intentData = await intentRes.json();
        if (!intentRes.ok)
          throw new Error(
            intentData.message || "Failed to create payment intent",
          );

        setClientSecret(intentData.clientSecret);
      } catch (err) {
        console.error("Stripe initialization error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    initStripe();
  }, []);

  if (loading) return <p>Loading payment...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}
