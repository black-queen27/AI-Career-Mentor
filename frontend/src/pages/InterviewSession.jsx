import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateInterview } from "../api/interviewApi";

export default function InterviewSession() {
  const location = useLocation();
  const navigate = useNavigate();

  const { role, experience, interviewType } =
    location.state || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState([]);

  const [currentAnswer, setCurrentAnswer] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await generateInterview({
        role,
        experience_level: experience,
        interview_type: interviewType,
      });

      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
      alert("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const updatedAnswers = [
      ...answers,
      {
        question: questions[currentIndex],
        answer: currentAnswer,
      },
    ];

    setAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (currentIndex === questions.length - 1) {
      navigate("/interview-report", {
        state: {
          role,
          experience,
          interviewType,
          answers: updatedAnswers,
        },
      });
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.glow1} />
        <div style={styles.glow2} />
        <h2 style={styles.centerText}>Generating AI Questions...</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={styles.center}>
        <div style={styles.glow1} />
        <div style={styles.glow2} />
        <h2 style={styles.centerText}>No questions generated.</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div style={styles.card}>

        <h2 style={styles.heading}>
          Question {currentIndex + 1} of {questions.length}
        </h2>

        <div style={styles.questionBox}>
          {questions[currentIndex]}
        </div>

        <textarea
          rows={6}
          placeholder="Type your answer here..."
          value={currentAnswer}
          onChange={(e) =>
            setCurrentAnswer(e.target.value)
          }
          style={styles.textarea}
          className="is-textarea"
        />

        <button
          style={styles.button}
          className="is-button"
          onClick={handleNext}
        >
          {currentIndex === questions.length - 1
            ? "Finish Interview"
            : "Next Question"}
        </button>

      </div>

      {/* Hover/focus states that inline styles can't express */}
      <style>{`
        .is-textarea::placeholder {
          color: rgba(226, 228, 240, 0.35);
        }
        .is-textarea:focus {
          border-color: rgba(239, 68, 68, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
        }
        .is-button:hover {
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
    width: "100%",
    maxWidth: 800,
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    padding: 40,
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  },

  heading: {
    color: "#ffffff",
    margin: 0,
  },

  questionBox: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderLeft: "3px solid #ef4444",
    color: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 600,
  },

  textarea: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: 15,
    resize: "vertical",
    outline: "none",
  },

  button: {
    marginTop: 20,
    padding: "12px 20px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },

  center: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    background: "#08060f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  centerText: {
    position: "relative",
    zIndex: 1,
    color: "#ffffff",
  },
};
