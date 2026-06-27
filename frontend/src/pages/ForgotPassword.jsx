import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage({
      type: "",
      text: "",
    });

    try {
      await sendPasswordResetEmail(auth, email);

      setMessage({
        type: "success",
        text:
          "Password reset link has been sent to your email.",
      });

      setEmail("");

    } catch (error) {
      let errorMsg = "Failed to send reset email.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMsg = "No account found with this email.";
          break;

        case "auth/invalid-email":
          errorMsg = "Please enter a valid email address.";
          break;

        default:
          errorMsg = error.message;
      }

      setMessage({
        type: "danger",
        text: errorMsg,
      });
    }

    setLoading(false);
  };

  return (
    <div className="fp-page-wrapper">
      <div className="fp-glow fp-glow-1" />
      <div className="fp-glow fp-glow-2" />

      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>

        <div className="row justify-content-center">

          <div className="col-md-6 col-lg-5">

            <div className="card auth-card">

              <div className="card-body p-5">

                <div className="text-center mb-4">

                  <h2 className="page-title">
                    Forgot Password
                  </h2>

                  <p className="text-muted fp-subtext">
                    Enter your registered email to reset
                    your password.
                  </p>

                </div>

                {message.text && (
                  <div
                    className={`alert alert-${message.type} fp-alert fp-alert-${message.type}`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <div className="mb-4">

                    <label className="form-label fp-label">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control fp-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-custom fp-btn-primary w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Sending..."
                      : "Send Reset Link"}
                  </button>

                </form>

                <div className="text-center mt-4">

                  <Link
                    to="/login"
                    className="text-decoration-none fp-link"
                  >
                    ← Back to Login
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <ForgotPasswordStyles />
    </div>
  );
}

// Scoped styles — kept local to this page so nothing else in the app is affected.
// Overrides are scoped under .fp-page-wrapper so any global .auth-card /
// .page-title / .btn-custom classes used elsewhere (Login, Register)
// are left untouched unless you apply the same wrapper there.
function ForgotPasswordStyles() {
  return (
    <style>{`
      .fp-page-wrapper {
        position: relative;
        min-height: 100vh;
        background: #08060f;
        overflow: hidden;
      }

      .fp-glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        pointer-events: none;
        z-index: 0;
      }

      .fp-glow-1 {
        width: 480px;
        height: 480px;
        top: -120px;
        right: -80px;
        background: radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%);
      }

      .fp-glow-2 {
        width: 420px;
        height: 420px;
        bottom: -100px;
        left: -100px;
        background: radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%);
      }

      .fp-page-wrapper .auth-card {
        background: rgba(255, 255, 255, 0.04) !important;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45) !important;
      }

      .fp-page-wrapper .page-title {
        color: #ffffff;
      }

      .fp-page-wrapper .fp-subtext {
        color: rgba(226, 228, 240, 0.6) !important;
      }

      .fp-page-wrapper .fp-label {
        color: rgba(226, 228, 240, 0.75);
      }

      .fp-page-wrapper .fp-input {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: #ffffff !important;
        border-radius: 10px;
      }

      .fp-page-wrapper .fp-input::placeholder {
        color: rgba(226, 228, 240, 0.35);
      }

      .fp-page-wrapper .fp-input:focus {
        background: rgba(255, 255, 255, 0.07) !important;
        border-color: rgba(124, 92, 255, 0.6) !important;
        box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.2) !important;
        color: #ffffff !important;
      }

      .fp-page-wrapper .fp-btn-primary {
        background: linear-gradient(135deg, #7c5cff, #a855f7) !important;
        border: none !important;
        color: #ffffff !important;
        font-weight: 600;
        border-radius: 10px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .fp-page-wrapper .fp-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(124, 92, 255, 0.35);
      }

      .fp-page-wrapper .fp-btn-primary:disabled {
        opacity: 0.6;
      }

      .fp-page-wrapper .fp-link {
        color: #c4b5fd;
      }

      .fp-page-wrapper .fp-link:hover {
        color: #ffffff;
      }

      .fp-page-wrapper .fp-alert {
        border: 1px solid transparent;
        border-radius: 10px;
      }

      .fp-page-wrapper .fp-alert-success {
        background: rgba(34, 197, 94, 0.12) !important;
        border-color: rgba(34, 197, 94, 0.3) !important;
        color: #86efac !important;
      }

      .fp-page-wrapper .fp-alert-danger {
        background: rgba(239, 68, 68, 0.12) !important;
        border-color: rgba(239, 68, 68, 0.3) !important;
        color: #fca5a5 !important;
      }
    `}</style>
  );
}

export default ForgotPassword;
