import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VoiceInterviewPrep() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [interviewType, setInterviewType] = useState("Technical");

  const startInterview = () => {
    if (!role.trim()) {
      alert("Enter Role");
      return;
    }

    navigate("/voice-interview", {
      state: {
        role,
        experienceLevel,
        interviewType
      }
    });
  };

  return (
    <div style={styles.page} className="vip-root">
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div style={styles.card}>

        <h1 style={styles.heading}>🎤 Voice Interview Preparation</h1>

        <div style={styles.formGroup}>
          <label style={styles.label}>Target Role</label>

          <input
            type="text"
            placeholder="Frontend Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
            className="vip-field"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Experience Level</label>

          <select
            value={experienceLevel}
            onChange={(e) =>
              setExperienceLevel(e.target.value)
            }
            style={styles.input}
            className="vip-field"
          >
            <option style={styles.option}>Fresher</option>
            <option style={styles.option}>1-3 Years</option>
            <option style={styles.option}>3-5 Years</option>
            <option style={styles.option}>5+ Years</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Interview Type</label>

          <select
            value={interviewType}
            onChange={(e) =>
              setInterviewType(e.target.value)
            }
            style={styles.input}
            className="vip-field"
          >
            <option style={styles.option}>Technical</option>
            <option style={styles.option}>HR</option>
            <option style={styles.option}>Behavioral</option>
            <option style={styles.option}>Mixed</option>
          </select>
        </div>

        <button
          style={styles.button}
          className="vip-button"
          onClick={startInterview}
        >
          Start Voice Interview
        </button>

      </div>

      {/* Hover/focus states that inline styles can't express */}
      <style>{`
        .vip-field::placeholder {
          color: rgba(226, 228, 240, 0.35);
        }
        .vip-field:focus {
          border-color: rgba(124, 92, 255, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.2) !important;
          outline: none;
        }
        .vip-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 26px rgba(124, 92, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#08060f",
    overflow: "hidden",
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
    background: "radial-gradient(circle, rgba(124,92,255,0.32), transparent 70%)",
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
    background: "radial-gradient(circle, rgba(34,197,94,0.22), transparent 70%)",
  },

  card: {
    position: "relative",
    zIndex: 1,
    width: 500,
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: 40,
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  },

  heading: {
    color: "#ffffff",
    marginTop: 0,
  },

  formGroup: {
    marginBottom: 20,
  },

  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 600,
    color: "rgba(226, 228, 240, 0.75)",
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: 15,
  },

  option: {
    background: "#15101f",
    color: "#ffffff",
  },

  button: {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(135deg, #7c5cff, #a855f7)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
};
