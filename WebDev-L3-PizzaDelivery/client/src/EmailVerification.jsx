import { useEffect, useState } from "react";

function EmailVerification({ onBack }) {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/auth/verify-email?token=${encodeURIComponent(
            token
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Email verification failed."
          );
        }

        setStatus("success");
        setMessage(data.message);
      } catch (error) {
        console.error(
          "Email verification failed:",
          error
        );

        setStatus("error");
        setMessage(
          error.message ||
            "Unable to verify your email."
        );
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          🍕
        </div>

        <h1>Crust & Co.</h1>

        {status === "verifying" && (
          <>
            <h2>Verifying your email...</h2>
            <p>Please wait while we activate your account.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2>Email Verified! 🎉</h2>
            <p>{message}</p>

            <button
              className="auth-submit"
              onClick={() => {
  window.history.pushState({}, "", "/login");
  window.location.reload();
}}
            >
              Continue to Login →
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2>Verification Failed</h2>
            <p>{message}</p>

            <button
              className="auth-submit"
              onClick={() => {
  window.history.pushState({}, "", "/login");
  window.location.reload();
}}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EmailVerification;