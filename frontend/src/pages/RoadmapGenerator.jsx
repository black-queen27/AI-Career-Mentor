import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase/firebase";

export default function RoadmapGenerator() {
  const [report, setReport] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  // Load existing roadmap
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        if (!user) return;

        const res = await axios.get(
          `http://localhost:8000/get-roadmap/${user.uid}`
        );

        if (res.data.roadmap) {
          setRoadmap(res.data.roadmap);
          setProgress(res.data.progress || {});
        }
      } catch (err) {
        console.log("Roadmap fetch error:", err);
      }
    };

    fetchRoadmap();
  }, [user]);

  // Load latest report
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/latest-report"
        );

        setReport(res.data);
      } catch (err) {
        console.log("Report fetch error:", err);
      }
    };

    fetchReport();
  }, []);

  // Generate roadmap
  const generateRoadmap = async () => {
    if (!report || !user) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/generate-roadmap",
        {
          user_id: user.uid,
          target_role: report.target_role || "Software Developer",
          missing_skills: report.missing_skills || []
        }
      );

      setRoadmap(res.data.roadmap);
      setProgress(res.data.progress);
    } catch (err) {
      console.log(err);
      alert("Roadmap generation failed");
    }

    setLoading(false);
  };

  // Save checkbox state
  const handleCheckboxChange = async (week) => {
    const updatedProgress = {
      ...progress,
      [week]: !progress[week]
    };

    setProgress(updatedProgress);

    try {
      await axios.post(
        "http://localhost:8000/roadmap/update-progress",
        {
          user_id: user.uid,
          progress: updatedProgress
        }
      );
    } catch (err) {
      console.log("Progress update error:", err);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 900,
        margin: "auto"
      }}
    >
      <h2>🚀 AI Learning Roadmap</h2>

      {report && (
        <div style={box}>
          <h3>Missing Skills</h3>

          <p>
            {report.missing_skills?.join(", ") ||
              "No missing skills"}
          </p>
        </div>
      )}

      <button
        onClick={generateRoadmap}
        style={btn}
      >
        {loading
          ? "Generating..."
          : "Generate My Roadmap"}
      </button>

      {roadmap && (
        <div style={{ marginTop: 30 }}>
          {Object.entries(roadmap).map(
            ([week, tasks]) => (
              <div
                key={week}
                style={weekCard}
              >
                <div style={header}>
                  <h3>{week}</h3>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        progress?.[week] || false
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          week
                        )
                      }
                    />

                    {" "}Done
                  </label>
                </div>

                <ul>
                  {tasks.map((task, index) => (
                    <li key={index}>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

const box = {
  marginTop: 20,
  padding: 20,
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#fff"
};

const weekCard = {
  marginBottom: 20,
  padding: 20,
  borderRadius: 12,
  background: "#fff",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10
};

const btn = {
  padding: "12px 20px",
  background: "#7c3aed",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 15,
  fontWeight: "bold"
};