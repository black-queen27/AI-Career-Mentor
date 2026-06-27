import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000"
});

export const analyzeSkillGap = (data) =>
  API.post("/analyze-skill-gap", data);