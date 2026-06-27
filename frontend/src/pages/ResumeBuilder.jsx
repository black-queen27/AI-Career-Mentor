import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { generateResume } from "../api/resumeBuilderApi";
import ResumePreview from "../components/ResumePreview";

export default function ResumeBuilder() {
  const [loading, setLoading] = useState(false);

  const [resume, setResume] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "",
    summary: "",
    skills: "",
    education: "",
    projects: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const result = await generateResume(formData);

      setResume(result);
    } catch (err) {
      console.error(err);
      alert("Failed to generate resume");
    } finally {
      setLoading(false);
    }
  };

    const downloadPDF = async () => {
  const element = document.getElementById(
    "resume-preview"
  );

  const canvas = await html2canvas(
    element,
    {
      scale: 2,
      useCORS: true,
    }
  );

  const imgData = canvas.toDataURL(
    "image/png"
  );

  const pdf = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  const pdfWidth =
    pdf.internal.pageSize.getWidth();

  const pdfHeight =
    pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;

  const imgHeight =
    (canvas.height * imgWidth) /
    canvas.width;

  let heightLeft =
    imgHeight;

  let position = 0;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );

  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position =
      heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pdfHeight;
  }

  pdf.save("resume.pdf");
};
  return (
    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          📄 AI Resume Builder
        </h1>

        <p style={styles.subtitle}>
          Generate an ATS-friendly resume using AI
        </p>

        <div style={styles.grid}>

          <input
            style={styles.input}
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="role"
            placeholder="Target Role"
            onChange={handleChange}
          />

        </div>

        <textarea
          style={styles.textarea}
          rows="3"
          name="summary"
          placeholder="Professional Summary"
          onChange={handleChange}
        />

        <textarea
          style={styles.textarea}
          rows="3"
          name="skills"
          placeholder="Skills"
          onChange={handleChange}
        />

        <textarea
          style={styles.textarea}
          rows="4"
          name="education"
          placeholder="Education"
          onChange={handleChange}
        />

        <textarea
          style={styles.textarea}
          rows="4"
          name="projects"
          placeholder="Projects"
          onChange={handleChange}
        />

        <textarea
          style={styles.textarea}
          rows="4"
          name="experience"
          placeholder="Experience"
          onChange={handleChange}
        />

        <button
          style={styles.generateBtn}
          onClick={handleGenerate}
        >
          {loading
            ? "Generating..."
            : "Generate Resume"}
        </button>

      </div>

      {resume && (
        <div style={styles.previewSection}>

          <button
            style={styles.downloadBtn}
            onClick={downloadPDF}
          >
            Download PDF
          </button>

          <ResumePreview
            resume={resume}
          />

        </div>
      )}

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "#08090f",
    padding: "40px",
    color: "#fff",
    fontFamily: "cursive",
  },

  card: {
    maxWidth: "1000px",
    margin: "auto",
    background:
      "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "40px",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "15px",
    marginBottom: "15px",
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #444",
    background: "#141824",
    color: "#fff",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #444",
    background: "#141824",
    color: "#fff",
    marginBottom: "15px",
    outline: "none",
  },

  generateBtn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#7c5cff,#a855f7)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  downloadBtn: {
    marginTop: "30px",
    marginBottom: "20px",
    padding: "12px 25px",
    border: "none",
    borderRadius: "12px",
    background: "#10b981",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  previewSection: {
    maxWidth: "1000px",
    margin: "40px auto",
  },
};