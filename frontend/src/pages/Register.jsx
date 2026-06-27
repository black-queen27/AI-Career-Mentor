import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import API from "../api/axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
    targetRole: "",
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

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      education: "",
      experience: "",
      skills: "",
      targetRole: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    setLoading(true);

    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const firebaseUser = userCredential.user;

      // Save additional profile details in FastAPI/MySQL
      await API.post("/users", {
        firebase_uid: firebaseUser.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        education: formData.education,
        experience: formData.experience,
        skills: formData.skills,
        target_role: formData.targetRole,
      });

      setMessage({
        type: "success",
        text: "Registration successful!",
      });

      clearForm();
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.message,
      });
    }

    setLoading(false);
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-glow register-glow-1" />
      <div className="register-glow register-glow-2" />

      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card auth-card">
              <div className="card-body p-5">

                <div className="text-center mb-4">
                  <h2 className="page-title">
                    Create Your Account
                  </h2>

                  <p className="text-muted register-subtext">
                    Start your AI Career Mentor journey
                  </p>
                </div>

                {message.text && (
                  <div className={`alert alert-${message.type} register-alert register-alert-${message.type}`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label className="form-label register-label">
                        Full Name
                      </label>

                      <input
                        type="text"
                        className="form-control register-input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label register-label">
                        Email
                      </label>

                      <input
                        type="email"
                        className="form-control register-input"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                      />
                    </div>

                  </div>

                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label className="form-label register-label">
                        Password
                      </label>

                      <input
                        type="password"
                        className="form-control register-input"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimum 6 characters"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label register-label">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        className="form-control register-input"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </div>

                  </div>

                  <div className="mb-3">
                    <label className="form-label register-label">
                      Education
                    </label>

                    <textarea
                      className="form-control register-input"
                      rows="2"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="B.Tech CSE, XYZ College..."
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label register-label">
                      Experience
                    </label>

                    <textarea
                      className="form-control register-input"
                      rows="2"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Internships, projects..."
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label register-label">
                      Skills
                    </label>

                    <input
                      type="text"
                      className="form-control register-input"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="React, Python, SQL..."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label register-label">
                      Target Job Role
                    </label>

                    <select
                      className="form-select register-input"
                      name="targetRole"
                      value={formData.targetRole}
                      onChange={handleChange}
                      required
                    >
                      <option value="" className="register-option">
                        Select Target Role
                      </option>

                      <option className="register-option">
                        Frontend Developer
                      </option>

                      <option className="register-option">
                        Backend Developer
                      </option>

                      <option className="register-option">
                        Full Stack Developer
                      </option>

                      <option className="register-option">
                        Data Analyst
                      </option>

                      <option className="register-option">
                        Data Scientist
                      </option>

                      <option className="register-option">
                        Machine Learning Engineer
                      </option>

                      <option className="register-option">
                        AI Engineer
                      </option>

                      <option className="register-option">
                        Software Engineer
                      </option>

                      <option className="register-option">
                        DevOps Engineer
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-custom register-btn-primary w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Account..."
                      : "Register"}
                  </button>

                </form>

              </div>
            </div>
          </div>
        </div>
      </div>

      <RegisterStyles />
    </div>
  );
}

// Scoped styles — kept local to this page so nothing else in the app is affected.
// Overrides are scoped under .register-page-wrapper so any global .auth-card /
// .page-title / .btn-custom classes used elsewhere (Login, Forgot Password)
// are left untouched unless you apply the same wrapper there.
function RegisterStyles() {
  return (
    <style>{`
      .register-page-wrapper {
        position: relative;
        min-height: 100vh;
        background: #08060f;
        overflow: hidden;
      }

      .register-glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        pointer-events: none;
        z-index: 0;
      }

      .register-glow-1 {
        width: 480px;
        height: 480px;
        top: -120px;
        right: -80px;
        background: radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%);
      }

      .register-glow-2 {
        width: 420px;
        height: 420px;
        bottom: -100px;
        left: -100px;
        background: radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%);
      }

      .register-page-wrapper .auth-card {
        background: rgba(255, 255, 255, 0.04) !important;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45) !important;
      }

      .register-page-wrapper .page-title {
        color: #ffffff;
      }

      .register-page-wrapper .register-subtext {
        color: rgba(226, 228, 240, 0.6) !important;
      }

      .register-page-wrapper .register-label {
        color: rgba(226, 228, 240, 0.75);
      }

      .register-page-wrapper .register-input {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: #ffffff !important;
        border-radius: 10px;
      }

      .register-page-wrapper .register-input::placeholder {
        color: rgba(226, 228, 240, 0.35);
      }

      .register-page-wrapper .register-input:focus {
        background: rgba(255, 255, 255, 0.07) !important;
        border-color: rgba(124, 92, 255, 0.6) !important;
        box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.2) !important;
        color: #ffffff !important;
      }

      .register-page-wrapper .register-option {
        background: #15101f;
        color: #ffffff;
      }

      /* Bootstrap's form-select draws its own chevron icon in dark SVG;
         swap it for a light one so it's visible on the dark field */
      .register-page-wrapper select.register-input {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23e2e4f0' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
      }

      .register-page-wrapper .register-btn-primary {
        background: linear-gradient(135deg, #7c5cff, #a855f7) !important;
        border: none !important;
        color: #ffffff !important;
        font-weight: 600;
        border-radius: 10px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .register-page-wrapper .register-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(124, 92, 255, 0.35);
      }

      .register-page-wrapper .register-btn-primary:disabled {
        opacity: 0.6;
      }

      .register-page-wrapper .register-alert {
        border: 1px solid transparent;
        border-radius: 10px;
      }

      .register-page-wrapper .register-alert-success {
        background: rgba(34, 197, 94, 0.12) !important;
        border-color: rgba(34, 197, 94, 0.3) !important;
        color: #86efac !important;
      }

      .register-page-wrapper .register-alert-danger {
        background: rgba(239, 68, 68, 0.12) !important;
        border-color: rgba(239, 68, 68, 0.3) !important;
        color: #fca5a5 !important;
      }
    `}</style>
  );
}

export default Register;
