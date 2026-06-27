import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import API from "../api/axios";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";

function ViewReport() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      const response = await API.get(
        `/resume/history/${user.uid}`
      );

      console.log("Reports:", response.data);

      setReports(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  const safeParse = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  };

  return (
    <div className="vr-page-wrapper">
      <div className="vr-glow vr-glow-1" />
      <div className="vr-glow vr-glow-2" />

      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>

        <BackButton
          to="/dashboard"
          label="Dashboard"
        />

        <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
          <h2 className="vr-heading">
            Resume Report History
          </h2>

          <button
            className="btn vr-btn-primary"
            onClick={() => navigate("/resume-upload")}
          >
            Analyze New Resume
          </button>
        </div>

        {loading && (
          <div className="text-center">
            <div
              className="spinner-border vr-spinner"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="mt-2 vr-muted-text">
              Loading reports...
            </p>
          </div>
        )}

        {error && (
          <div className="alert vr-alert vr-alert-danger">
            {error}
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="alert vr-alert vr-alert-info">
            No reports found.
          </div>
        )}

        {!loading &&
          reports.map((report) => (
            <div
              key={report.id}
              className="card vr-card mb-4"
            >
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <div>
                    <h4 className="mb-1 vr-heading">
                      {report.filename}
                    </h4>

                    {report.target_role && (
                      <p className="vr-muted-text mb-0">
                        Target Role:
                        <strong className="vr-strong">
                          {" "}
                          {report.target_role}
                        </strong>
                      </p>
                    )}
                  </div>

                  <div className="text-center">
                    <div
                      className="vr-score-circle rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      {report.resume_score}
                    </div>

                    <small className="vr-muted-text">
                      Score
                    </small>
                  </div>

                </div>

                <hr className="vr-divider" />

                <h5 className="vr-heading-success">
                  ✓ Strengths
                </h5>

                <ul className="vr-list">
                  {safeParse(report.strengths).map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>

                <h5 className="vr-heading-danger">
                  ✗ Missing Skills
                </h5>

                <ul className="vr-list">
                  {safeParse(
                    report.missing_skills
                  ).map((item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  ))}
                </ul>

                <h5 className="vr-heading-primary">
                  Suggestions
                </h5>

                <ul className="vr-list">
                  {safeParse(
                    report.suggestions
                  ).map((item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  ))}
                </ul>

                <h5 className="vr-heading-warning">
                  ATS Feedback
                </h5>

                <div className="alert vr-alert vr-alert-warning mb-0">
                  {report.ats_feedback}
                </div>

              </div>
            </div>
          ))}

      </div>

      <ViewReportStyles />
    </div>
  );
}

// Scoped styles — kept local to this page so nothing else in the app is affected.
function ViewReportStyles() {
  return (
    <style>{`
      .vr-page-wrapper {
        position: relative;
        min-height: 100vh;
        background: #08060f;
        overflow: hidden;
      }

      .vr-glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        pointer-events: none;
        z-index: 0;
      }

      .vr-glow-1 {
        width: 480px;
        height: 480px;
        top: -120px;
        right: -80px;
        background: radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%);
      }

      .vr-glow-2 {
        width: 420px;
        height: 420px;
        bottom: -100px;
        left: -100px;
        background: radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%);
      }

      .vr-card {
        background: rgba(255, 255, 255, 0.04) !important;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45) !important;
      }

      .vr-heading {
        color: #ffffff;
        font-weight: 700;
      }

      .vr-muted-text {
        color: rgba(226, 228, 240, 0.6);
      }

      .vr-strong {
        color: #ffffff;
      }

      .vr-divider {
        border-color: rgba(255, 255, 255, 0.08);
        opacity: 1;
      }

      .vr-score-circle {
        color: #ffffff;
        background: linear-gradient(135deg, #7c5cff, #a855f7);
        box-shadow: 0 8px 24px rgba(124, 92, 255, 0.4);
      }

      .vr-heading-success {
        color: #4ade80;
        font-weight: 700;
      }

      .vr-heading-danger {
        color: #f87171;
        font-weight: 700;
      }

      .vr-heading-primary {
        color: #a855f7;
        font-weight: 700;
      }

      .vr-heading-warning {
        color: #fbbf24;
        font-weight: 700;
      }

      .vr-list {
        color: rgba(226, 228, 240, 0.85);
        padding-left: 1.25rem;
        margin-bottom: 1.25rem;
      }

      .vr-list li {
        margin-bottom: 0.35rem;
      }

      .vr-btn-primary {
        background: linear-gradient(135deg, #7c5cff, #a855f7);
        border: none;
        color: #ffffff;
        font-weight: 600;
        border-radius: 10px;
        padding: 0.5rem 1.25rem;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .vr-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(124, 92, 255, 0.35);
        color: #ffffff;
      }

      .vr-spinner {
        color: #a855f7;
      }

      .vr-alert {
        border: 1px solid transparent;
        border-radius: 10px;
      }

      .vr-alert-danger {
        background: rgba(239, 68, 68, 0.12);
        border-color: rgba(239, 68, 68, 0.3);
        color: #fca5a5;
      }

      .vr-alert-info {
        background: rgba(59, 130, 246, 0.12);
        border-color: rgba(59, 130, 246, 0.3);
        color: #93c5fd;
      }

      .vr-alert-warning {
        background: rgba(251, 191, 36, 0.12);
        border-color: rgba(251, 191, 36, 0.3);
        color: #fde68a;
      }
    `}</style>
  );
}

export default ViewReport;
