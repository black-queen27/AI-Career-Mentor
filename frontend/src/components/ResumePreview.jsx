import ReactMarkdown from "react-markdown";
export default function ResumePreview({ resume }) {
  if (!resume) return null;

  return (
    <div
      id="resume-preview"
      style={{
        background: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        color: "#000000",
        maxWidth: "850px",
        margin: "30px auto",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.8",
        textAlign: "left",
        whiteSpace: "pre-wrap",
      }}
    >

      <div
        style={{
          fontSize: "15px",
        }}
      >
        <ReactMarkdown>{resume.resume}</ReactMarkdown>
      </div>
    </div>
  );
}