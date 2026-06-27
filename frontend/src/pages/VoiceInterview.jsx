import { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { auth } from "../firebase/firebase";

import {
  generateQuestion,
  submitAnswer,
  submitInterview,
} from "../api/voiceApi";

export default function VoiceInterview() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    role,
    experienceLevel,
    interviewType,
  } = location.state || {};

  const [questions, setQuestions] = useState([]);
const [currentQuestion, setCurrentQuestion] = useState(0);

const [audioFile, setAudioFile] = useState(null);

const [answers, setAnswers] = useState([]);

const [report, setReport] = useState(null);

const [loading, setLoading] = useState(false);

const [recording, setRecording] = useState(false);

const [completed, setCompleted] = useState(false);
const speakQuestion = (text) => {
  if (!text) return;

  speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  speechSynthesis.speak(utterance);
};
useEffect(() => {
  if (
    questions.length > 0 &&
    currentQuestion < questions.length
  ) {
    speakQuestion(
      questions[currentQuestion]
    );
  }
}, [currentQuestion, questions]);
  let mediaRecorder;
  let audioChunks = [];

  if (!role) {
    return (
      <div style={styles.page} className="vi-root">
        <div style={styles.glow1} />
        <div style={styles.glow2} />

        <div style={{ padding: 40, position: "relative", zIndex: 1 }}>
          <h2>No Interview Configuration Found</h2>

          <button
            style={styles.dashboardBtn}
            onClick={() =>
              navigate("/voice-interview-prep")
            }
          >
            Go Back
          </button>
        </div>

        <VoiceInterviewStyles />
      </div>
    );
  }

  const handleGenerateQuestion = async () => {
    try {
      const user = auth.currentUser;

      const data = await generateQuestion({
        firebase_uid: user.uid,
        role,
        experience_level: experienceLevel,
        interview_type: interviewType,
      });

      setQuestions(data.questions || []);

setCurrentQuestion(0);

setAnswers([]);

setAudioFile(null);

setReport(null);

setCompleted(false);
    } catch (err) {
      console.error(err);
      alert("Failed to generate questions");
    }
  };

  const startRecording = async () => {
    try {
      speechSynthesis.cancel();
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      mediaRecorder = new MediaRecorder(stream);

      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, {
          type: "audio/webm",
        });

        const file = new File(
          [blob],
          "answer.webm",
          {
            type: "audio/webm",
          }
        );

        setAudioFile(file);
      };

      mediaRecorder.start();

      window.currentRecorder = mediaRecorder;

      setRecording(true);
    } catch (err) {
      console.error(err);
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (window.currentRecorder) {
      window.currentRecorder.stop();
      setRecording(false);
    }
  };

  const handleSubmit = async () => {
  if (!audioFile) {
    alert("Please record an answer first.");
    return;
  }

  try {
    setLoading(true);

    const user = auth.currentUser;

    const result = await submitAnswer({
      firebase_uid: user.uid,
      role,
      question: questions[currentQuestion],
      audio: audioFile,
    });

    const updatedAnswers = [
      ...answers,
      {
        question: questions[currentQuestion],
        transcript: result.transcript,
      },
    ];

    setAnswers(updatedAnswers);

    // Move to next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);

      setAudioFile(null);

      alert(
        `Answer saved. Moving to Question ${
          currentQuestion + 2
        }`
      );
    }

    // Last Question
    else {
      const finalReport =
        await submitInterview({
          firebase_uid: user.uid,
          role,
          questions,
          answers: updatedAnswers,
        });

      setReport(finalReport);

      setCompleted(true);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to submit answer.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.page} className="vi-root">
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div style={styles.container}>
        <button
          style={styles.dashboardBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <h1 style={styles.title}>
          🎤 AI Voice Interview
        </h1>

        <div style={styles.card}>
          <p>
            <strong>Role:</strong> {role}
          </p>

          <p>
            <strong>Experience:</strong>{" "}
            {experienceLevel}
          </p>

          <p>
            <strong>Interview Type:</strong>{" "}
            {interviewType}
          </p>
        </div>

        <div style={styles.card}>
          <button
            style={styles.primaryBtn}
            onClick={handleGenerateQuestion}
          >
            Generate Questions
          </button>

          {questions.length > 0 && !completed && (
            <>
              <h2 style={{ marginTop: 25 }}>
                Question {currentQuestion + 1} of {questions.length}
              </h2>

              <p style={styles.question}>
  {questions[currentQuestion]}
</p>

<button
  style={styles.speakBtn}
  onClick={() =>
    speakQuestion(
      questions[currentQuestion]
    )
  }
>
  🔊 Read Question Again
</button>

              <div style={{ marginTop: 20 }}>
                {!recording ? (
                  <button
                    style={styles.recordBtn}
                    onClick={startRecording}
                  >
                    🎙 Start Recording
                  </button>
                ) : (
                  <button
                    style={styles.stopBtn}
                    onClick={stopRecording}
                  >
                    ⏹ Stop Recording
                  </button>
                )}
              </div>

              {audioFile && (
                <p style={styles.readyText}>
                  ✅ Recording Ready
                </p>
              )}

              <button
                style={styles.submitBtn}
                onClick={handleSubmit}
              >
                {loading
                  ? "Evaluating..."
                  : "Submit Answer"}
              </button>
            </>
          )}
        </div>

        {completed && report && (
  <div style={styles.card}>
    <h2>🎯 Final Interview Evaluation</h2>

    <h3>Questions & Your Answers</h3>

    {answers.map((item, index) => (
      <div
        key={index}
        style={styles.answerBox}
      >
        <p>
          <strong>
            Question {index + 1}
          </strong>
        </p>

        <p>{item.question}</p>

        <p>
          <strong>Your Answer:</strong>
        </p>

        <p>{item.transcript}</p>
      </div>
    ))}

    <div style={styles.scoreGrid}>
      <div style={styles.scoreCard}>
        <h3>Technical</h3>
        <h2 style={styles.scoreNumber}>{report.technical_score}%</h2>
      </div>

      <div style={styles.scoreCard}>
        <h3>Communication</h3>
        <h2 style={styles.scoreNumber}>{report.communication_score}%</h2>
      </div>

      <div style={styles.scoreCard}>
        <h3>Problem Solving</h3>
        <h2 style={styles.scoreNumber}>{report.problem_solving_score}%</h2>
      </div>

      <div style={styles.scoreCard}>
        <h3>Overall</h3>
        <h2 style={styles.scoreNumber}>{report.overall_score}%</h2>
      </div>
    </div>

    <h3>💪 Strengths</h3>

    <ul>
      {report.overall_strengths?.map(
        (item, index) => (
          <li key={index}>{item}</li>
        )
      )}
    </ul>

    <h3>📈 Areas for Improvement</h3>

    <ul>
      {report.areas_for_improvement?.map(
        (item, index) => (
          <li key={index}>{item}</li>
        )
      )}
    </ul>

    <h3>🎯 Recommendations</h3>

    <ul>
      {report.recommendations?.map(
        (item, index) => (
          <li key={index}>{item}</li>
        )
      )}
    </ul>
  </div>
)}

        {completed && (
  <div style={styles.card}>
    <h2>✅ Interview Completed</h2>

    <p>
      Your final evaluation has been generated
      from all 5 answers.
    </p>

    <button
      style={styles.primaryBtn}
      onClick={() =>
        navigate("/voice-history")
      }
    >
      View History
    </button>
  </div>
)}
      </div>

      <VoiceInterviewStyles />
    </div>
  );
}

// Scoped styles — kept local to this page so nothing else in the app is affected.
function VoiceInterviewStyles() {
  return (
    <style>{`
      .vi-root h1, .vi-root h2, .vi-root h3 {
        color: #ffffff;
      }

      .vi-root p {
        color: rgba(226, 228, 240, 0.85);
      }

      .vi-root strong {
        color: #ffffff;
      }

      .vi-root ul {
        color: rgba(226, 228, 240, 0.85);
        padding-left: 1.25rem;
      }

      .vi-root li {
        margin-bottom: 6px;
      }

      .vi-root button {
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .vi-root button:hover {
        transform: translateY(-1px);
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
    padding: "40px 20px",
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

  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1000,
    margin: "0 auto",
  },

  title: {
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: 25,
    borderRadius: 16,
    marginBottom: 25,
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },

  question: {
    fontSize: 18,
    lineHeight: 1.8,
  },

  primaryBtn: {
    background: "linear-gradient(135deg, #7c5cff, #a855f7)",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },

  speakBtn: {
    marginTop: 10,
    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    color: "#1c1306",
    border: "none",
    padding: "10px 15px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },

  recordBtn: {
    background: "linear-gradient(135deg, #16a34a, #4ade80)",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },

  stopBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },

  submitBtn: {
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 20,
    fontWeight: 600,
  },

  dashboardBtn: {
    background: "transparent",
    color: "rgba(226, 228, 240, 0.85)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    padding: "12px 20px",
    borderRadius: 10,
    cursor: "pointer",
    marginBottom: 20,
    fontWeight: 500,
  },

  readyText: {
    color: "#4ade80",
    marginTop: 15,
    fontWeight: 600,
  },

  answerBox: {
    marginBottom: 20,
    padding: 15,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: 15,
    marginTop: 20,
    marginBottom: 20,
  },

  scoreCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
  },

  scoreNumber: {
    background: "linear-gradient(135deg, #7c5cff, #a855f7)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
  },
};
