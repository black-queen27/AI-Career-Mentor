import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

export default function InterviewReport() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    role,
    experience,
    interviewType,
    answers = [],
  } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    evaluateInterview();
  }, []);

  const evaluateInterview = async () => {
    try {
      const user = auth.currentUser;

      const response = await fetch(
        "http://localhost:8000/interview/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebase_uid: user?.uid,
            questions: answers.map((a) => a.question),
            answers: answers.map((a) => a.answer),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail);
      }

      setReport(data);
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate interview.");
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>No Interview Report Found</h2>

          <button
            style={styles.button}
            onClick={() => navigate("/interview-prep")}
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Evaluating Interview...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ marginBottom: 20 }}>
          <button
            style={styles.dashboardButton}
            onClick={() => navigate("/dashboard")}
          >
            ← Return to Dashboard
          </button>
        </div>

        <h1 style={styles.title}>
          🎯 AI Interview Report
        </h1>

        <div style={styles.summaryCard}>
          <p><strong>Role:</strong> {role}</p>
          <p><strong>Experience:</strong> {experience}</p>
          <p><strong>Interview Type:</strong> {interviewType}</p>
          <p><strong>Questions Attempted:</strong> {answers.length}</p>
        </div>

        <div style={styles.scoreGrid}>
          <div style={styles.scoreCard}>
            <h3>Technical</h3>
            <h2>{report?.technical_score}%</h2>
          </div>

          <div style={styles.scoreCard}>
            <h3>Communication</h3>
            <h2>{report?.communication_score}%</h2>
          </div>

          <div style={styles.scoreCard}>
            <h3>Problem Solving</h3>
            <h2>{report?.problem_solving_score}%</h2>
          </div>

          <div style={styles.scoreCard}>
            <h3>Overall</h3>
            <h2>{report?.overall_score}%</h2>
          </div>
        </div>

        <div style={styles.sectionCard}>
          <h2>💪 Overall Strengths</h2>

          <ul>
            {report?.overall_strengths?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={styles.sectionCard}>
          <h2>📈 Areas for Improvement</h2>

          <ul>
            {report?.areas_for_improvement?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={styles.sectionCard}>
          <h2>🎯 Recommendations</h2>

          <ul>
            {report?.recommendations?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <button
          style={styles.button}
          onClick={() => navigate("/interview-prep")}
        >
          Take Another Interview
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#f0f4ff,#faf5ff,#f0fdf4)",
    padding: "40px 20px",
  },

  container: {
    maxWidth: 950,
    margin: "0 auto",
  },

  title: {
    textAlign: "center",
    marginBottom: 30,
    color: "#1e293b",
  },

  summaryCard: {
    background: "#fff",
    padding: 25,
    borderRadius: 16,
    marginBottom: 25,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    lineHeight: 2,
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: 20,
    marginBottom: 30,
  },

  scoreCard: {
    background: "#fff",
    padding: 25,
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  sectionCard: {
    background: "#fff",
    padding: 25,
    borderRadius: 16,
    marginBottom: 25,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    lineHeight: 2,
  },

  button: {
    padding: "12px 20px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
  },

  dashboardButton: {
    padding: "12px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#fff",
    padding: 40,
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};