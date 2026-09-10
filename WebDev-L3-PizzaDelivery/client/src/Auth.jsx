import { useState } from "react";

function Auth({ onLogin, onBack }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (forgotPassword) {
      if (!email.trim()) {
        setMessage("Please enter your email.");
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5001/api/auth/forgot-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Password reset request failed"
          );
        }

        setMessage(data.message);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }

      return;
    }

    if (mode === "register" && !name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const endpoint =
        mode === "login"
          ? "http://localhost:5001/api/auth/login"
          : "http://localhost:5001/api/auth/register";

      const body =
        mode === "login"
          ? {
              email,
              password,
            }
          : {
              name,
              email,
              password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Authentication failed"
        );
      }

      if (mode === "register") {
        setMessage(
          "Account created successfully 🍕 Please login."
        );
        setMode("login");
        setName("");
        setPassword("");
      } else {
        localStorage.setItem(
          "crustCoToken",
          data.token
        );

        localStorage.setItem(
          "crustCoUser",
          JSON.stringify(data.user)
        );

        if (onLogin) {
          onLogin(data.user);
        }
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🍕</span>
          <h1>Crust & Co.</h1>
        </div>

        <p className="auth-subtitle">
          {forgotPassword
            ? "Reset your Crust & Co. password."
            : mode === "login"
            ? "Welcome back. Your pizza is waiting."
            : "Create your Crust & Co. account."}
        </p>

        {!forgotPassword && (
          <div className="auth-tabs">
            <button
              type="button"
              className={
                mode === "login" ? "active" : ""
              }
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Login
            </button>

            <button
              type="button"
              className={
                mode === "register" ? "active" : ""
              }
              onClick={() => {
                setMode("register");
                setMessage("");
              }}
            >
              Register
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "register" && !forgotPassword && (
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
            />
          </label>

          {!forgotPassword && (
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
              />
            </label>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : forgotPassword
              ? "Send Reset Request →"
              : mode === "login"
              ? "Login →"
              : "Create account →"}
          </button>
        </form>

        {!forgotPassword && mode === "login" && (
          <button
            type="button"
            className="forgot-password-button"
            onClick={() => {
              setForgotPassword(true);
              setMessage("");
            }}
          >
            Forgot Password?
          </button>
        )}

        {forgotPassword && (
          <button
            type="button"
            className="forgot-password-button"
            onClick={() => {
              setForgotPassword(false);
              setMessage("");
            }}
          >
            ← Back to Login
          </button>
        )}

        {message && (
          <p className="auth-message">{message}</p>
        )}

        <button
          type="button"
          className="location-button"
          onClick={onBack}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Auth;