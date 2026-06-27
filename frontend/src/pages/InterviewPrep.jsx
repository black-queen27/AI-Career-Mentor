import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InterviewPrep() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Python Developer");
  const [experience, setExperience] = useState("Fresher");
  const [interviewType, setInterviewType] = useState("Technical");

  const roles = [
    "Flutter Developer",
    "Python Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "UI/UX Designer",
  ];

  const experienceLevels = [
    "Fresher",
    "0–1 Years",
    "1–3 Years",
    "3–5 Years",
    "5+ Years",
  ];

  const interviewTypes = [
    "Technical",
    "HR",
    "Behavioral",
    "Mixed",
  ];

  const handleStart = () => {
    navigate("/interview-session", {
      state: {
        role,
        experience,
        interviewType,
      },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div style={styles.card}>
        <h1 style={styles.title}>🎤 AI Interview Preparation</h1>

        <p style={styles.subtitle}>
          Configure your interview and start practicing.
        </p>

        {/* Role */}
        <div style={styles.field}>
          <label style={styles.label}>Select Role</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
            className="ip-select"
          >
            {roles.map((r) => (
              <option key={r} style={styles.option}>{r}</option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div style={styles.field}>
          <label style={styles.label}>Experience Level</label>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            style={styles.select}
            className="ip-select"
          >
            {experienceLevels.map((exp) => (
              <option key={exp} style={styles.option}>{exp}</option>
            ))}
          </select>
        </div>

        {/* Interview Type */}
        <div style={styles.field}>
          <label style={styles.label}>Interview Type</label>

          <select
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
            style={styles.select}
            className="ip-select"
          >
            {interviewTypes.map((type) => (
              <option key={type} style={styles.option}>{type}</option>
            ))}
          </select>
        </div>

        <button
          style={styles.startButton}
          className="ip-start-btn"
          onClick={handleStart}
        >
          Start Interview →
        </button>
      </div>

      {/* Hover/focus states that inline styles can't express */}
      <style>{`
        .ip-select:focus {
          border-color: rgba(239, 68, 68, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
        }
        .ip-start-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 26px rgba(239, 68, 68, 0.45);
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "#08060f",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "'Allura', cursive",
  },

  glow1: {
    position: "absolute",
    width: 480,
    height: 480,
    top: -120,
    right: -80,
    borderRadius: "50%",
    filter: "blur(60px)",
    pointerEvents: "none",
    zIndex: 0,
    background: "radial-gradient(circle, rgba(239,68,68,0.3), transparent 70%)",
  },

  glow2: {
    position: "absolute",
    width: 420,
    height: 420,
    bottom: -100,
    left: -100,
    borderRadius: "50%",
    filter: "blur(60px)",
    pointerEvents: "none",
    zIndex: 0,
    background: "radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%)",
  },

  card: {
    position: "relative",
    zIndex: 1,
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    width: "100%",
    maxWidth: 500,
    borderRadius: 24,
    padding: 40,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  },

  title: {
    margin: 0,
    marginBottom: 10,
    color: "#ffffff",
    fontSize: 30,
    fontWeight: 800,
  },

  subtitle: {
    color: "rgba(226, 228, 240, 0.6)",
    marginBottom: 30,
    fontSize: 15,
  },

  field: {
    marginBottom: 22,
  },

  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 600,
    color: "rgba(226, 228, 240, 0.75)",
  },

  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: 15,
    outline: "none",
  },

  option: {
    background: "#15101f",
    color: "#ffffff",
  },

  startButton: {
    width: "100%",
    padding: "14px",
    marginTop: 15,
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
};
