import { auth } from "../firebase/firebase";

const BASE_URL = "http://localhost:8000";

export const generateInterview = async (data) => {
  const user = auth.currentUser;

  const response = await fetch(
    `${BASE_URL}/interview/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebase_uid: user?.uid,
        role: data.role,
        experience_level: data.experience_level,
        interview_type: data.interview_type,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Failed to generate interview questions."
    );
  }

  return result;
};