import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function ResumeReport() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get actual report data
  const report = location.state?.report;

  if (!report) {
    return (
      <div className="report-page-wrapper">
        <div className="report-glow report-glow-1" />
        <div className="report-glow report-glow-2" />

        <div className="container py-5 text-center position-relative" style={{ zIndex: 1 }}>
          <div className="alert report-alert report-alert-warning">
            No analysis report found.
          </div>

          <button
            className="btn report-btn-primary"
            onClick={() => navigate("/resume-upload")}
          >
            Analyze Resume
          </button>
        </div>

        <ReportStyles />
      </div>
    );
  }

  return (
    <div className="report-page-wrapper">
      <div className="report-glow report-glow-1" />
      <div className="report-glow report-glow-2" />

      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>

        <BackButton
          to="/dashboard"
          label="Dashboard"
        />

        {/* Header */}
        <div className="card report-card mb-4 mt-3">
          <div className="card-body text-center">

            <h2 className="mb-3 report-heading">
              Resume Analysis Report
            </h2>

            <p className="report-muted-text">
              File: <strong className="report-strong">{report.filename}</strong>
            </p>

            {report.target_role && (
              <p className="report-muted-text">
                Target Role:
                <strong className="report-strong"> {report.target_role}</strong>
              </p>
            )}

            <div className="display-4 fw-bold report-score">
              {report.resume_score}/100
            </div>

            <p className="report-muted-text">
              Resume Score
            </p>

          </div>
        </div>

        <div className="row">

          {/* Strengths */}
          <div className="col-md-6 mb-4">
            <div className="card report-card h-100">

              <div className="card-body">

                <h4 className="report-heading-success mb-3">
                  ✓ Strengths
                </h4>

                {report.strengths?.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {report.strengths.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item report-list-item"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="report-muted-text">No strengths found.</p>
                )}

              </div>

            </div>
          </div>

          {/* Missing Skills */}
          <div className="col-md-6 mb-4">
            <div className="card report-card h-100">

              <div className="card-body">

                <h4 className="report-heading-danger mb-3">
                  ✗ Missing Skills
                </h4>

                {report.missing_skills?.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {report.missing_skills.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item report-list-item"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="report-muted-text">No missing skills identified.</p>
                )}

              </div>

            </div>
          </div>

        </div>

        {/* Suggestions */}
        <div className="card report-card mb-4">

          <div className="card-body">

            <h4 className="report-heading-primary mb-3">
              Suggestions
            </h4>

            {report.suggestions?.length > 0 ? (
              <ul className="list-group list-group-flush">
                {report.suggestions.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item report-list-item"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="report-muted-text">No suggestions available.</p>
            )}

          </div>

        </div>

        {/* ATS Feedback */}
        <div className="card report-card mb-4">

          <div className="card-body">

            <h4 className="report-heading-warning mb-3">
              ATS Compatibility Feedback
            </h4>

            <p className="mb-0 report-body-text">
              {report.ats_feedback}
            </p>

          </div>

        </div>

        {/* Actions */}
        <div className="text-center pb-3">

          <button
            className="btn report-btn-outline me-3"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

          <button
            className="btn report-btn-primary me-3"
            onClick={() => navigate("/resume-upload")}
          >
            Analyze Another Resume
          </button>

          <button
            className="btn report-btn-success"
            onClick={() => navigate("/view-report")}
          >
            View All Reports
          </button>

        </div>

      </div>

      <ReportStyles />
    </div>
  );
}

// Scoped styles — kept local to this page so nothing else in the app is affected.
function ReportStyles() {
  return (
    <style>{`
      .report-page-wrapper {
        position: relative;
        min-height: 100vh;
        background: #08060f;
        overflow: hidden;
      }

      .report-glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        pointer-events: none;
        z-index: 0;
      }

      .report-glow-1 {
        width: 480px;
        height: 480px;
        top: -120px;
        right: -80px;
        background: radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%);
      }

      .report-glow-2 {
        width: 420px;
        height: 420px;
        bottom: -100px;
        left: -100px;
        background: radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%);
      }

      .report-card {
        background: rgba(255, 255, 255, 0.04) !important;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45) !important;
      }

      .report-heading {
        color: #ffffff;
        font-weight: 700;
      }

      .report-muted-text {
        color: rgba(226, 228, 240, 0.6);
      }

      .report-body-text {
        color: rgba(226, 228, 240, 0.85);
      }

      .report-strong {
        color: #ffffff;
      }

      .report-score {
        background: linear-gradient(135deg, #7c5cff, #a855f7);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }

      .report-heading-success {
        color: #4ade80;
        font-weight: 700;
      }

      .report-heading-danger {
        color: #f87171;
        font-weight: 700;
      }

      .report-heading-primary {
        color: #a855f7;
        font-weight: 700;
      }

      .report-heading-warning {
        color: #fbbf24;
        font-weight: 700;
      }

      .report-list-item {
        background: rgba(255, 255, 255, 0.04) !important;
        color: rgba(226, 228, 240, 0.85) !important;
        border-color: rgba(255, 255, 255, 0.08) !important;
      }

      .report-list-item:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      .report-list-item:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }

      .report-btn-primary {
        background: linear-gradient(135deg, #7c5cff, #a855f7);
        border: none;
        color: #ffffff;
        font-weight: 600;
        border-radius: 10px;
        padding: 0.5rem 1.25rem;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .report-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(124, 92, 255, 0.35);
        color: #ffffff;
      }

      .report-btn-success {
        background: linear-gradient(135deg, #22c55e, #4ade80);
        border: none;
        color: #ffffff;
        font-weight: 600;
        border-radius: 10px;
        padding: 0.5rem 1.25rem;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .report-btn-success:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(34, 197, 94, 0.35);
        color: #ffffff;
      }

      .report-btn-outline {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: rgba(226, 228, 240, 0.85);
        font-weight: 500;
        border-radius: 10px;
        padding: 0.5rem 1.25rem;
        transition: background 0.15s ease, border-color 0.15s ease;
      }

      .report-btn-outline:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.3);
        color: #ffffff;
      }

      .report-alert {
        border: 1px solid transparent;
        border-radius: 10px;
        margin-bottom: 1.5rem;
      }

      .report-alert-warning {
        background: rgba(251, 191, 36, 0.12);
        border-color: rgba(251, 191, 36, 0.3);
        color: #fde68a;
      }
    `}</style>
  );
}

export default ResumeReport;
