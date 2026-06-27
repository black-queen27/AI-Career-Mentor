import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { updateProfile } from "firebase/auth";
import API from "../api/axios";
import BackButton from "../components/BackButton";

function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
    target_role: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      const response = await API.get(`/users/${user.uid}`);

      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        education: response.data.education || "",
        experience: response.data.experience || "",
        skills: response.data.skills || "",
        target_role: response.data.target_role || "",
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      // Save profile data to backend
      await API.put(`/users/${user.uid}`, formData);

      // Update Firebase display name
      await updateProfile(auth.currentUser, {
        displayName: formData.name,
      });

      setMessage("Profile updated successfully!");

      // Navigate back to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Failed to update profile."
      );
    }
  };

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-glow profile-glow-1" />
        <div className="profile-glow profile-glow-2" />

        <div className="container py-5 text-center position-relative" style={{ zIndex: 1 }}>
          <div className="spinner-border profile-spinner" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="mt-3 profile-muted-text">Loading profile...</p>
        </div>

        <ProfileStyles />
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-glow profile-glow-1" />
      <div className="profile-glow profile-glow-2" />

      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">

            <BackButton
              to="/dashboard"
              label="Dashboard"
            />

            <div className="card profile-card shadow border-0 mt-3">
              <div className="card-body p-5">

                <div className="text-center mb-4">
                  <div className="profile-avatar rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <h2 className="profile-heading">My Profile</h2>

                  <p className="profile-muted-text">
                    Update your career details
                  </p>
                </div>

                {message && (
                  <div className="alert profile-alert profile-alert-success">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="alert profile-alert profile-alert-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSave}>

                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label className="form-label profile-label">
                        Name
                      </label>

                      <input
                        type="text"
                        className="form-control profile-input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label profile-label">
                        Email
                      </label>

                      <input
                        type="email"
                        className="form-control profile-input"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label className="form-label profile-label">
                        Phone
                      </label>

                      <input
                        type="text"
                        className="form-control profile-input"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label profile-label">
                        Experience
                      </label>

                      <input
                        type="text"
                        className="form-control profile-input"
                        name="experience"
                        placeholder="Example: Fresher"
                        value={formData.experience}
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  <div className="mb-3">
                    <label className="form-label profile-label">
                      Education
                    </label>

                    <textarea
                      className="form-control profile-input"
                      rows="3"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label profile-label">
                      Skills
                    </label>

                    <textarea
                      className="form-control profile-input"
                      rows="3"
                      name="skills"
                      placeholder="Example: React, Python, SQL"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label profile-label">
                      Target Job Role
                    </label>

                    <input
                      type="text"
                      className="form-control profile-input"
                      name="target_role"
                      placeholder="Example: AI Engineer"
                      value={formData.target_role}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="d-grid gap-2">

                    <button
                      type="submit"
                      className="btn btn-lg profile-btn-primary"
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="btn profile-btn-outline"
                      onClick={() =>
                        navigate("/dashboard")
                      }
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>
      </div>

      <ProfileStyles />
    </div>
  );
}

// Scoped styles — kept local to this page so nothing else in the app is affected.
function ProfileStyles() {
  return (
    <style>{`
      .profile-page-wrapper {
        position: relative;
        min-height: 100vh;
        background: #08060f;
        overflow: hidden;
      }

      .profile-glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        pointer-events: none;
        z-index: 0;
      }

      .profile-glow-1 {
        width: 480px;
        height: 480px;
        top: -120px;
        right: -80px;
        background: radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%);
      }

      .profile-glow-2 {
        width: 420px;
        height: 420px;
        bottom: -100px;
        left: -100px;
        background: radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%);
      }

      .profile-card {
        background: rgba(255, 255, 255, 0.04) !important;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45) !important;
      }

      .profile-avatar {
        width: 80px;
        height: 80px;
        font-size: 32px;
        font-weight: bold;
        color: #fff;
        background: linear-gradient(135deg, #7c5cff, #a855f7);
        box-shadow: 0 8px 24px rgba(124, 92, 255, 0.4);
      }

      .profile-heading {
        color: #ffffff;
        font-weight: 700;
      }

      .profile-muted-text {
        color: rgba(226, 228, 240, 0.6);
      }

      .profile-label {
        color: rgba(226, 228, 240, 0.75);
        font-weight: 500;
      }

      .profile-input {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: #ffffff !important;
        border-radius: 10px;
      }

      .profile-input::placeholder {
        color: rgba(226, 228, 240, 0.35);
      }

      .profile-input:focus {
        background: rgba(255, 255, 255, 0.07) !important;
        border-color: rgba(124, 92, 255, 0.6) !important;
        box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.2) !important;
        color: #ffffff !important;
      }

      .profile-btn-primary {
        background: linear-gradient(135deg, #7c5cff, #a855f7);
        border: none;
        color: #ffffff;
        font-weight: 600;
        border-radius: 10px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .profile-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(124, 92, 255, 0.35);
        color: #ffffff;
      }

      .profile-btn-outline {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: rgba(226, 228, 240, 0.85);
        font-weight: 500;
        border-radius: 10px;
        transition: background 0.15s ease, border-color 0.15s ease;
      }

      .profile-btn-outline:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.3);
        color: #ffffff;
      }

      .profile-alert {
        border: 1px solid transparent;
        border-radius: 10px;
      }

      .profile-alert-success {
        background: rgba(34, 197, 94, 0.12);
        border-color: rgba(34, 197, 94, 0.3);
        color: #86efac;
      }

      .profile-alert-danger {
        background: rgba(239, 68, 68, 0.12);
        border-color: rgba(239, 68, 68, 0.3);
        color: #fca5a5;
      }

      .profile-spinner {
        color: #a855f7;
      }
    `}</style>
  );
}

export default Profile;
