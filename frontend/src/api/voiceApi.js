import axios from "axios";

const API = "http://localhost:8000/voice-interview";

// -------------------------------------
// Generate 5 Questions
// -------------------------------------
export const generateQuestion = async (data) => {
  const formData = new FormData();

  formData.append("firebase_uid", data.firebase_uid);
  formData.append("role", data.role);
  formData.append(
    "experience_level",
    data.experience_level
  );
  formData.append(
    "interview_type",
    data.interview_type
  );

  const res = await axios.post(
    `${API}/generate-question`,
    formData
  );

  return res.data;
};

// -------------------------------------
// Submit Single Answer (Transcription)
// -------------------------------------
export const submitAnswer = async (data) => {
  const formData = new FormData();

  formData.append(
    "firebase_uid",
    data.firebase_uid
  );

  formData.append(
    "role",
    data.role
  );

  formData.append(
    "question",
    data.question
  );

  formData.append(
    "audio",
    data.audio
  );

  const res = await axios.post(
    `${API}/submit-answer`,
    formData
  );

  return res.data;
};

// -------------------------------------
// Submit Complete Interview
// -------------------------------------
export const submitInterview = async (data) => {
  const formData = new FormData();

  formData.append(
    "firebase_uid",
    data.firebase_uid
  );

  formData.append(
    "role",
    data.role
  );

  formData.append(
    "questions",
    JSON.stringify(data.questions)
  );

  formData.append(
    "answers",
    JSON.stringify(data.answers)
  );

  const res = await axios.post(
    `${API}/submit-interview`,
    formData
  );

  return res.data;
};

// -------------------------------------
// Voice Interview History
// -------------------------------------
export const getHistory = async (uid) => {
  const res = await axios.get(
    `${API}/history/${uid}`
  );

  return res.data;
};