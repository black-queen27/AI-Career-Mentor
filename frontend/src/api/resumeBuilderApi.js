import axios from "axios";

const API =
  "http://localhost:8000/resume-builder";

export const generateResume = async (
  data
) => {
  const res = await axios.post(
    `${API}/generate`,
    data
  );

  return res.data;
};