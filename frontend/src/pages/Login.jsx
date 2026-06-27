import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage({
      type: "",
      text: "",
    });

    try {
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      setMessage({
        type: "success",
        text: "Login successful!",
      });

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (error) {
      let errorMsg = "Login failed.";

      switch (error.code) {
        case "auth/invalid-credential":
          errorMsg = "Invalid email or password.";
          break;

        case "auth/user-not-found":
          errorMsg = "User not found.";
          break;

        case "auth/wrong-password":
          errorMsg = "Incorrect password.";
          break;

        case "auth/too-many-requests":
          errorMsg =
            "Too many failed attempts. Try again later.";
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
    <div className="login-page-wrapper">
      <div className="login-glow login-glow-1" />
      <div className="login-glow login-glow-2" />

      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>

        <div className="row justify-content-center">

          <div className="col-md-6 col-lg-5">

            <div className="card auth-card">

              <div className="card-body p-5">

                <div className="text-center mb-4">

                  <h2 className="page-title">
                    Welcome Back
                  </h2>

                  <p className="text-muted login-subtext">
                    Login to continue your AI Career Journey
                  </p>

                </div>

                {message.text && (
                  <div
                    className={`alert alert-${message.type} login-alert login-alert-${message.type}`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">

                    <label className="form-label login-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control login-input"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />

                  </div>

                  <div className="mb-4">

                    <label className="form-label login-label">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control login-input"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-custom login-btn-primary w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Logging in..."
                      : "Login"}
                  </button>

                </form>

                <div className="text-center mt-4">

                  <Link
                    to="/forgot-password"
                    className="text-decoration-none login-link"
                  >
                    Forgot Password?
                  </Link>

                </div>

                <div className="text-center mt-3">

                  <p className="mb-0 login-subtext">

                    Don't have an account?{" "}

                    <Link
                      to="/register"
                      className="text-decoration-none fw-bold login-link"
                    >
                      Register
                    </Link>

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <LoginStyles />
    </div>
  );
}

// Scoped styles — kept local to this page so nothing else in the app is affected.
// Overrides are scoped under .login-page-wrapper so any global .auth-card /
// .page-title / .btn-custom classes used elsewhere (Register, Forgot Password)
// are left untouched unless you apply the same wrapper there.
function LoginStyles() {
  return (
    <style>{`
      .login-page-wrapper {
        position: relative;
        min-height: 100vh;
        background: #08060f;
        overflow: hidden;
      }

      .login-glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        pointer-events: none;
        z-index: 0;
      }

      .login-glow-1 {
        width: 480px;
        height: 480px;
        top: -120px;
        right: -80px;
        background: radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%);
      }

      .login-glow-2 {
        width: 420px;
        height: 420px;
        bottom: -100px;
        left: -100px;
        background: radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%);
      }

      .login-page-wrapper .auth-card {
        background: rgba(255, 255, 255, 0.04) !important;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45) !important;
      }

      .login-page-wrapper .page-title {
        color: #ffffff;
      }

      .login-page-wrapper .login-subtext {
        color: rgba(226, 228, 240, 0.6) !important;
      }

      .login-page-wrapper .login-label {
        color: rgba(226, 228, 240, 0.75);
      }

      .login-page-wrapper .login-input {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: #ffffff !important;
        border-radius: 10px;
      }

      .login-page-wrapper .login-input::placeholder {
        color: rgba(226, 228, 240, 0.35);
      }

      .login-page-wrapper .login-input:focus {
        background: rgba(255, 255, 255, 0.07) !important;
        border-color: rgba(124, 92, 255, 0.6) !important;
        box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.2) !important;
        color: #ffffff !important;
      }

      .login-page-wrapper .login-btn-primary {
        background: linear-gradient(135deg, #7c5cff, #a855f7) !important;
        border: none !important;
        color: #ffffff !important;
        font-weight: 600;
        border-radius: 10px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .login-page-wrapper .login-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(124, 92, 255, 0.35);
      }

      .login-page-wrapper .login-btn-primary:disabled {
        opacity: 0.6;
      }

      .login-page-wrapper .login-link {
        color: #c4b5fd;
      }

      .login-page-wrapper .login-link:hover {
        color: #ffffff;
      }

      .login-page-wrapper .login-alert {
        border: 1px solid transparent;
        border-radius: 10px;
      }

      .login-page-wrapper .login-alert-success {
        background: rgba(34, 197, 94, 0.12) !important;
        border-color: rgba(34, 197, 94, 0.3) !important;
        color: #86efac !important;
      }

      .login-page-wrapper .login-alert-danger {
        background: rgba(239, 68, 68, 0.12) !important;
        border-color: rgba(239, 68, 68, 0.3) !important;
        color: #fca5a5 !important;
      }
    `}</style>
  );
}

export default Login;
