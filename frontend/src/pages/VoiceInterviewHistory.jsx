import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function VoiceInterviewHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const response = await fetch(
        `http://localhost:8000/voice-interview/history/${user.uid}`
      );

      const data = await response.json();

      setHistory(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page} className="vh-root">
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div style={styles.container}>
        <button
          style={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <h1 style={styles.title}>
          🎤 Voice Interview History
        </h1>

        {loading ? (
          <h3>Loading...</h3>
        ) : history.length === 0 ? (
          <div style={styles.card}>
            <h3>No Voice Interviews Found</h3>
          </div>
        ) : (
          history.map((item) => {
            let questions = [];
            let answers = [];

            try {
              questions = JSON.parse(
                item.question || "[]"
              );

              answers = JSON.parse(
                item.transcript || "[]"
              );
            } catch (err) {
              console.error(err);
            }

            return (
              <div
                key={item.id}
                style={styles.card}
              >
                <h2>{item.role}</h2>

                <div style={styles.scoreGrid}>
                  <div style={styles.scoreCard}>
                    <h4>Technical</h4>
                    <h2 style={styles.scoreNumber}>
                      {item.technical_score}%
                    </h2>
                  </div>

                  <div style={styles.scoreCard}>
                    <h4>Communication</h4>
                    <h2 style={styles.scoreNumber}>
                      {item.communication_score}%
                    </h2>
                  </div>

                  <div style={styles.scoreCard}>
                    <h4>Problem Solving</h4>
                    <h2 style={styles.scoreNumber}>
                      {item.problem_solving_score}%
                    </h2>
                  </div>

                  <div style={styles.scoreCard}>
                    <h4>Overall</h4>
                    <h2 style={styles.scoreNumber}>
                      {item.overall_score}%
                    </h2>
                  </div>
                </div>

                <h3
                  style={{
                    marginTop: 25,
                  }}
                >
                  Questions & Answers
                </h3>

                {questions.map(
                  (question, index) => (
                    <div
                      key={index}
                      style={
                        styles.questionCard
                      }
                    >
                      <p>
                        <strong>
                          Question{" "}
                          {index + 1}
                        </strong>
                      </p>

                      <p>{question}</p>

                      <p>
                        <strong>
                          Answer
                        </strong>
                      </p>

                      <p>
                        {answers[index]
                          ?.transcript ||
                          "No Answer"}
                      </p>
                    </div>
                  )
                )}

                <h3>💪 Strengths</h3>

                <ul>
                  {item.overall_strengths?.map(
                    (s, i) => (
                      <li key={i}>
                        {s}
                      </li>
                    )
                  )}
                </ul>

                <h3>
                  📈 Areas for Improvement
                </h3>

                <ul>
                  {item.areas_for_improvement?.map(
                    (s, i) => (
                      <li key={i}>
                        {s}
                      </li>
                    )
                  )}
                </ul>

                <h3>
                  🎯 Recommendations
                </h3>

                <ul>
                  {item.recommendations?.map(
                    (s, i) => (
                      <li key={i}>
                        {s}
                      </li>
                    )
                  )}
                </ul>
              </div>
            );
          })
        )}
      </div>

      <VoiceHistoryStyles />
    </div>
  );
}

// Scoped styles — kept local to this page so nothing else in the app is affected.
function VoiceHistoryStyles() {
  return (
    <style>{`
      .vh-root h1, .vh-root h2, .vh-root h3, .vh-root h4 {
        color: #ffffff;
      }

      .vh-root p {
        color: rgba(226, 228, 240, 0.85);
      }

      .vh-root strong {
        color: #ffffff;
      }

      .vh-root ul {
        color: rgba(226, 228, 240, 0.85);
        padding-left: 1.25rem;
      }

      .vh-root li {
        margin-bottom: 6px;
      }

      .vh-root button {
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .vh-root button:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.4);
      }
    `}</style>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "#08060f",
    overflow: "hidden",
    padding: "30px",
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
    background: "radial-gradient(circle, rgba(59,130,246,0.32), transparent 70%)",
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
    background: "radial-gradient(circle, rgba(168,85,247,0.22), transparent 70%)",
  },

  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1000px",
    margin: "0 auto",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
  },

  card: {
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "25px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },

  questionCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    marginTop: "10px",
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(150px,1fr))",
    gap: "15px",
    marginTop: "20px",
    marginBottom: "20px",
  },

  scoreCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "15px",
    textAlign: "center",
    borderRadius: "10px",
  },

  scoreNumber: {
    background: "linear-gradient(135deg, #3b82f6, #a855f7)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
  },

  backBtn: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "20px",
    fontWeight: 600,
  },
};
