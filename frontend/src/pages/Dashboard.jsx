import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [progress, setProgress] = useState({});

  const toggleProgress = (week) => {
    setProgress((prev) => ({
      ...prev,
      [week]: !prev[week],
    }));
  };
  // Add this useEffect inside Dashboard() for the particles:
useEffect(() => {
  const wrap = document.getElementById('particles');
  if (!wrap) return;
  const colors = ['#6366f1', '#a855f7', '#22d3ee', '#f43f5e', '#4ade80', '#fbbf24'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.className = 'floating-particle';
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100 + 50}%;
      box-shadow: 0 0 ${size * 2}px ${color};
      opacity: 0.5;
      animation-duration: ${Math.random() * 14 + 8}s;
      animation-delay: -${Math.random() * 12}s;
    `;
    wrap.appendChild(p);
  }
  return () => { wrap.innerHTML = ''; };
}, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else navigate("/login");
    });
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const firstName =
    user?.displayName?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  const generateRoadmap = async () => {
    if (!user?.uid) {
      alert("User not found.");
      return;
    }
    setLoadingRoadmap(true);
    try {
      const reportRes = await fetch(
        `http://localhost:8000/resume/latest/${user.uid}`
      );
      if (!reportRes.ok) {
        const err = await reportRes.json();
        throw new Error(err.detail || "Could not fetch latest resume report.");
      }
      const report = await reportRes.json();
      let missingSkills = report.missing_skills;
      if (typeof missingSkills === "string") {
        missingSkills = JSON.parse(missingSkills);
      }
      if (!missingSkills || missingSkills.length === 0) {
        alert("No missing skills found in the latest report.");
        return;
      }
      const roadmapRes = await fetch("http://localhost:8000/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.uid,
          target_role: report.target_role,
          missing_skills: missingSkills,
        }),
      });
      const roadmapData = await roadmapRes.json();
      if (!roadmapRes.ok) {
        throw new Error(roadmapData.detail || "Failed to generate roadmap.");
      }
      if (roadmapData.roadmap) {
        setRoadmapData(roadmapData.roadmap);
      } else {
        setRoadmapData(roadmapData);
      }
      if (roadmapData.progress) {
        setProgress(roadmapData.progress);
      }
      alert("Roadmap generated successfully!");
    } catch (error) {
      console.error("Roadmap Error:", error);
      alert(error.message);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  useEffect(() => {
    if (!user?.uid) return;
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/get-roadmap/${user.uid}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.roadmap) setRoadmapData(data.roadmap);
        if (data.progress) setProgress(data.progress);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoadmap();
  }, [user]);

  const roadmapAccents = [
    "#4ade80", "#22d3ee", "#a78bfa", "#fbbf24", "#f472b6",
    "#34d399", "#60a5fa", "#fb923c",
  ];

  return (
    <div style={{
  minHeight: "100vh",
  background: "#08090f",
  fontFamily: "'Allura', cursive",
  position: "relative",
  overflow: "hidden",
}}>
          {/* Animated Background */}
    <div className="orb orb1" />
    <div className="orb orb2" />
    <div className="orb orb3" />
    <div className="orb orb4" />
    <div className="grid-lines" />
    <div id="particles" />

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.navLogoBox}>🎓</div>
          <span style={styles.navTitle}>AI Career Mentor</span>
          <span style={styles.betaChip}>Beta</span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.notifWrap}>
            <span style={{ fontSize: 20, color: "#6b7db3", cursor: "pointer" }}>🔔</span>
            <span style={styles.notifDot} />
          </div>
          <div
            style={styles.userDropdown}
            onClick={() => navigate("/profile")}
          >
            <div style={styles.avatarCircle}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            <span style={styles.navUsername}>{firstName}</span>
            <span style={{ fontSize: 12, color: "#4a5480" }}>▾</span>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main style={styles.main}>

        {/* Hero Banner */}
        <div style={styles.heroBanner}>
          <div style={styles.heroBlobTop} />
          <div style={styles.heroBlobBottom} />
          <div style={styles.heroBlobLeft} />
          <div style={styles.heroLeft}>
            <p style={styles.heroGreeting}>{greeting} 👋</p>
            <h1 style={styles.heroName}>{firstName}</h1>
            <p style={styles.heroEmail}>{user?.email}</p>
          
          </div>
        </div>
        {/* Quick Actions */}
        <div style={styles.actionsSection}>
          
          <div style={styles.actionsGrid}>
            <ActionCard
              emoji="👤"
              title="Complete Profile"
              desc="Fill in your skills, experience, and career goals to unlock personalized mentorship."
              btnLabel="Complete →"
              btnColor="#6366f1"
              accentColor="#6366f1"
              iconBg="#1a1540"
              onClick={() => navigate("/profile")}
            />
            <ActionCard
  emoji="📝"
  title="Resume Builder"
  desc="Generate a professional ATS-friendly resume using AI based on your skills, education, projects, and experience."
  btnLabel="Build Resume →"
  btnColor="#60a5fa"
  accentColor="#3b82f6"
  iconBg="#0f172a"
  onClick={() => navigate("/resume-builder")}
/>
            <ActionCard
              emoji="📄"
              title="Analyze Resume"
              desc="Upload your resume and get an AI-powered breakdown of strengths and gaps."
              btnLabel="Upload →"
              btnColor="#d9ee19"
              accentColor="#ddf31b"
              iconBg="#051a10"
              onClick={() => navigate("/resume-upload")}
            />
            <ActionCard
              emoji="📊"
              title="View Report"
              desc="See your detailed career readiness report and tailored recommendations."
              btnLabel="View →"
              btnColor="#7c3aed"
              accentColor="#a855f7"
              iconBg="#1e0a35"
              onClick={() => navigate("/view-report")}
            />
            <ActionCard
              emoji="✒️"
              title="AI Interview Prep"
              desc="Practice technical, HR, and behavioral interviews with AI."
              btnLabel="Start →"
              btnColor="#e11d48"
              accentColor="#f43f5e"
              iconBg="#250a10"
              onClick={() => navigate("/interview-prep")}
            />
            <ActionCard
  emoji="🎤"
  title="Voice Interview"
  desc="Practice interviews using your voice and get AI-powered feedback."
  btnLabel="Start →"
  btnColor="#7c3aed"
  accentColor="#a855f7"
  iconBg="#1e1b4b"
  onClick={() => navigate("/voice-interview-prep")}
/>

<ActionCard
  emoji="📜"
  title="Voice Interview History"
  desc="View your previous voice interviews, transcripts, and scores."
  btnLabel="View →"
  btnColor="#2563eb"
  accentColor="#3b82f6"
  iconBg="#0c1f3f"
  onClick={() => navigate("/voice-history")}
/>
          </div>
        </div>

        {/* Roadmap */}
        <div style={styles.progressSection}>
          <div style={styles.roadmapHeader}>
            <p style={styles.sectionTitle}>🗺️ AI Learning Roadmap</p>
            <button
              onClick={generateRoadmap}
              style={styles.generateBtn}
            >
              {loadingRoadmap ? "⏳ Generating..." : "✨ Generate My Roadmap"}
            </button>
          </div>

          {roadmapData && (
            <div style={styles.progressTrack}>
              {Object.entries(roadmapData).map(([week, tasks], index) => {
                const accent = roadmapAccents[index % roadmapAccents.length];
                const isDone = progress?.[week] || false;
                return (
                  <div
                    key={week}
                    style={{
                      ...styles.roadmapCard,
                      borderLeft: `3px solid ${isDone ? "#eff545" : accent}`,
                    }}
                  >
                    <div style={styles.roadmapCardHeader}>
                      <div style={styles.roadmapCardLeft}>
                        <div
                          style={{
                            ...styles.roadmapWeekBadge,
                            background: isDone ? "#0a2818" : "#1a1040",
                            color: isDone ? "#dcde4a" : accent,
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 style={styles.roadmapWeekTitle}>{week}</h3>
                          <span style={styles.roadmapEstimate}>
                            {isDone ? "✅ Completed" : "⏳ Pending"}
                          </span>
                        </div>
                      </div>
                      <div style={styles.roadmapCardRight}>
                        <span
                          style={{
                            ...styles.roadmapStatusChip,
                            background: isDone ? "#0a2818" : "#1a1040",
                            color: isDone ? "#4ade80" : accent,
                          }}
                        >
                          {isDone ? "Done" : "Upcoming"}
                        </span>
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleProgress(week)}
                          style={{ accentColor: accent, width: 16, height: 16, cursor: "pointer" }}
                        />
                      </div>
                    </div>
                    <ul style={styles.roadmapList}>
                      {tasks.map((task, i) => (
                        <li key={i} style={styles.roadmapListItem}>{task}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}


// ── Action Card Component ─────────────────────────────────────────
function ActionCard({ emoji, title, desc, btnLabel, btnColor, accentColor, iconBg, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...styles.actionCard,
        borderTop: `2px solid ${accentColor}`,
        borderColor: hovered ? accentColor : "#1a1d30",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.actionEmoji, background: iconBg }}>{emoji}</div>
      <h3 style={styles.actionTitle}>{title}</h3>
      <p style={styles.actionDesc}>{desc}</p>
      <button
        style={{ ...styles.actionBtn, background: btnColor }}
        onClick={onClick}
      >
        {btnLabel}
      </button>
    </div>
  );
}
const styles = {
  page: {
    minHeight: "100vh",
    background: "#08090f",
    fontFamily: "'Allura', cursive",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    height: 62,
    background: "#0d0f1e",
    borderBottom: "1px solid #1a1d30",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  navLogoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "#6366f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  navTitle: {
    fontWeight: 800,
    fontSize: 17,
    color: "#fff",
    letterSpacing: "-0.4px",
  },
  betaChip: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    background: "#2d1f6e",
    color: "#a78bfa",
    letterSpacing: "0.4px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  notifWrap: {
    position: "relative",
    cursor: "pointer",
  },
  notifDot: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    background: "#f43f5e",
    borderRadius: "50%",
    border: "2px solid #0d0f1e",
  },
  userDropdown: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#13162a",
    border: "1px solid #23284a",
    borderRadius: 10,
    padding: "5px 12px 5px 6px",
    cursor: "pointer",
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 7,
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
  },
  navUsername: {
    fontSize: 13,
    color: "#c4c9e8",
    fontWeight: 600,
  },
  logoutBtn: {
    padding: "7px 16px",
    borderRadius: 8,
    border: "1px solid #23284a",
    background: "transparent",
    color: "#6b7db3",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  main: {
    maxWidth: 1060,
    margin: "0 auto",
    padding: "28px 24px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  heroBanner: {
    position: "relative",
    background: "linear-gradient(135deg, #13162a 0%, #1a1040 50%, #130d2e 100%)",
    border: "1px solid #23284a",
    borderRadius: 22,
    padding: "36px 44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    minHeight: 170,
  },
  heroLeft: {
    position: "relative",
    zIndex: 2,
  },
  heroGreeting: {
    color: "#6b7db3",
    fontSize: 12,
    fontWeight: 700,
    margin: "0 0 6px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  heroName: {
    color: "#fff",
    fontSize: 34,
    fontWeight: 900,
    margin: "0 0 8px",
    letterSpacing: "-1.2px",
    lineHeight: 1,
    textTransform: "capitalize",
  },
  heroEmail: {
    color: "#4a5480",
    fontSize: 13,
    margin: "0 0 16px",
  },
  heroBadgeRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  heroBadgeCyan: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 20,
    background: "#0a2540",
    color: "#22d3ee",
    letterSpacing: "0.4px",
  },
  heroBadgeGreen: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 20,
    background: "#0a2818",
    color: "#4ade80",
    letterSpacing: "0.4px",
  },
  heroBadge: {},
  heroRight: {
    position: "relative",
    zIndex: 2,
    textAlign: "right",
  },
  heroIllustration: {},
  heroBlobTop: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: "50%",
    background: "rgba(99,102,241,0.12)",
    top: -120,
    right: 60,
    zIndex: 1,
    pointerEvents: "none",
  },
  heroBlobBottom: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background: "rgba(168,85,247,0.10)",
    bottom: -80,
    right: 20,
    zIndex: 1,
    pointerEvents: "none",
  },
  heroBlobLeft: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: "50%",
    background: "rgba(34,211,238,0.07)",
    top: -40,
    left: 220,
    zIndex: 1,
    pointerEvents: "none",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
  },
  statCard: {
    background: "#0d0f1e",
    borderRadius: 14,
    padding: "18px 20px",
    border: "1px solid #1a1d30",
  },
  statLabel: {
    color: "#4a5480",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  statValue: {
    fontSize: 28,
    fontWeight: 900,
    margin: "4px 0 8px",
    letterSpacing: "-1px",
  },
  statSub: {
    color: "#4a5480",
    fontSize: 11,
    margin: 0,
  },
  statIcon: {},
  progressBarOuter: {
    height: 6,
    background: "#1a1d2e",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 6,
  },
  progressBarInner: {
    height: "100%",
    borderRadius: 3,
  },
  chipCyan: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    background: "#0a2540",
    color: "#22d3ee",
  },
  chipGreen: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    background: "#0a2818",
    color: "#4ade80",
  },
  chipPurple: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    background: "#2d1f6e",
    color: "#a78bfa",
  },
  chipAmber: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    background: "#2d1a00",
    color: "#fbbf24",
  },
  actionsSection: {},
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#4a5480",
    margin: "0 0 14px",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
  },
  actionCard: {
    background: "#0d0f1e",
    borderRadius: 16,
    padding: "22px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    transition: "transform 0.2s ease, border-color 0.2s ease",
    cursor: "pointer",
    border: "1px solid #1a1d30",
  },
  actionEmoji: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#c4c9e8",
    margin: 0,
  },
  actionDesc: {
    fontSize: 11,
    color: "#4a5480",
    lineHeight: 1.6,
    margin: 0,
    flexGrow: 1,
  },
  actionBtn: {
    marginTop: 4,
    padding: "9px 14px",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  progressSection: {},
  roadmapHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  generateBtn: {
    padding: "9px 18px",
    border: "none",
    borderRadius: 9,
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  progressTrack: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  roadmapCard: {
    background: "#0d0f1e",
    padding: "18px 22px",
    borderRadius: 14,
    border: "1px solid #1a1d30",
    marginBottom: 0,
  },
  roadmapCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  roadmapCardLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  roadmapCardRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  roadmapWeekBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 800,
  },
  roadmapWeekTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#e2e8ff",
    margin: 0,
  },
  roadmapEstimate: {
    fontSize: 11,
    color: "#4a5480",
    marginTop: 2,
    display: "block",
  },
  roadmapStatusChip: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
  },
  roadmapList: {
    paddingLeft: 18,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  roadmapListItem: {
    fontSize: 12,
    color: "#6b7db3",
    lineHeight: 1.7,
  },
  progressStep: {},
  stepDot: {},
  stepLine: {},
  stepLabel: {},
};