import { useState } from "react";

function ResetPassword({ token, onBack }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!password || !confirmPassword) {
      setMessage("Please enter your new password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5001/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Password reset failed"
        );
      }

      setSuccess(true);
      setMessage(
        "Password updated successfully 🍕 You can now login."
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <span>🍕</span>
            <h1>Crust & Co.</h1>
          </div>

          <p className="auth-subtitle">
            Your password has been reset successfully.
          </p>

          <p className="auth-message">{message}</p>

          <button
            type="button"
            className="auth-submit"
            onClick={onBack}
          >
            Back to Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🍕</span>
          <h1>Crust & Co.</h1>
        </div>

        <p className="auth-subtitle">
          Create a new password for your account.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            New Password
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter new password"
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm new password"
            />
          </label>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Password →"}
          </button>
        </form>

        {message && (
          <p className="auth-message">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;