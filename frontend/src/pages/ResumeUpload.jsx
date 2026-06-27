import { useState } from "react";
import { auth } from "../firebase/firebase";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import BackButton from "../components/BackButton";

function ResumeUpload() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      navigate("/");
      return;
    }

    const formData = new FormData();

    formData.append("firebase_uid", user.uid);
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      setError("");

      const response = await API.post(
        "/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Navigate to current analysis report
      navigate("/resume-result", {
        state: {
          report: response.data,
        },
      });

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <div className="ru-page-wrapper">
        <div className="ru-glow ru-glow-1" />
        <div className="ru-glow ru-glow-2" />

        <div className="position-relative" style={{ zIndex: 1 }}>
          <LoadingSpinner
            text="Analyzing your resume with AI..."
          />
        </div>

        <ResumeUploadStyles />
      </div>
    );
  }

  return (
    <div className="ru-page-wrapper">
      <div className="ru-glow ru-glow-1" />
      <div className="ru-glow ru-glow-2" />

      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">

          <div className="col-md-8">

            <BackButton
              to="/dashboard"
              label="Dashboard"
            />

            <div className="card ru-card mt-3">

              <div className="card-body p-5">

                <h2 className="text-center mb-4 ru-heading">
                  Resume Analyzer
                </h2>

                <p className="text-center ru-muted-text">
                  Upload PDF, DOCX, or TXT resumes.
                </p>

                {error && (
                  <div className="alert ru-alert ru-alert-danger">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <input
                    type="file"
                    className="form-control ru-input"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </div>

                {selectedFile && (
                  <div className="alert ru-alert ru-alert-info">
                    Selected File:
                    <strong className="ru-strong">
                      {" "}
                      {selectedFile.name}
                    </strong>
                  </div>
                )}

                <button
                  className="btn ru-btn-primary w-100"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  Analyze Resume
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>

      <ResumeUploadStyles />
    </div>
  );
}

// Scoped styles — kept local to this page so nothing else in the app is affected.
function ResumeUploadStyles() {
  return (
    <style>{`
      .ru-page-wrapper {
        position: relative;
        min-height: 100vh;
        background: #08060f;
        overflow: hidden;
      }

      .ru-glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        pointer-events: none;
        z-index: 0;
      }

      .ru-glow-1 {
        width: 480px;
        height: 480px;
        top: -120px;
        right: -80px;
        background: radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%);
      }

      .ru-glow-2 {
        width: 420px;
        height: 420px;
        bottom: -100px;
        left: -100px;
        background: radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%);
      }

      .ru-card {
        background: rgba(255, 255, 255, 0.04) !important;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45) !important;
      }

      .ru-heading {
        color: #ffffff;
        font-weight: 700;
      }

      .ru-muted-text {
        color: rgba(226, 228, 240, 0.6);
      }

      .ru-strong {
        color: #ffffff;
      }

      .ru-input {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: #ffffff !important;
        border-radius: 10px;
      }

      .ru-input::file-selector-button {
        background: linear-gradient(135deg, #7c5cff, #a855f7);
        border: none;
        color: #ffffff;
        font-weight: 600;
        border-radius: 8px;
        padding: 0.4rem 0.9rem;
        margin-right: 1rem;
        cursor: pointer;
      }

      .ru-input::-webkit-file-upload-button {
        background: linear-gradient(135deg, #7c5cff, #a855f7);
        border: none;
        color: #ffffff;
        font-weight: 600;
        border-radius: 8px;
        padding: 0.4rem 0.9rem;
        margin-right: 1rem;
        cursor: pointer;
      }

      .ru-input:focus {
        background: rgba(255, 255, 255, 0.07) !important;
        border-color: rgba(124, 92, 255, 0.6) !important;
        box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.2) !important;
        color: #ffffff !important;
      }

      .ru-btn-primary {
        background: linear-gradient(135deg, #7c5cff, #a855f7);
        border: none;
        color: #ffffff;
        font-weight: 600;
        border-radius: 10px;
        padding: 0.6rem 1.25rem;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .ru-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(124, 92, 255, 0.35);
        color: #ffffff;
      }

      .ru-btn-primary:disabled {
        opacity: 0.6;
      }

      .ru-alert {
        border: 1px solid transparent;
        border-radius: 10px;
      }

      .ru-alert-danger {
        background: rgba(239, 68, 68, 0.12);
        border-color: rgba(239, 68, 68, 0.3);
        color: #fca5a5;
      }

      .ru-alert-info {
        background: rgba(59, 130, 246, 0.12);
        border-color: rgba(59, 130, 246, 0.3);
        color: #93c5fd;
      }
    `}</style>
  );
}

export default ResumeUpload;
