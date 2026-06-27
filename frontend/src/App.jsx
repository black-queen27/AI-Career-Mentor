import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ResumeUpload from "./pages/ResumeUpload";
import ResumeReport from "./pages/ResumeReport";
import ViewReport from "./pages/ViewReport";
import RoadmapGenerator from "./pages/RoadmapGenerator";
import InterviewPrep from "./pages/InterviewPrep";
import InterviewSession from "./pages/InterviewSession";
import InterviewReport from "./pages/InterviewReport";
import VoiceInterview from "./pages/VoiceInterview";
import VoiceInterviewHistory from "./pages/VoiceInterviewHistory";
import VoiceInterviewPrep from "./pages/VoiceInterviewPrep";
import ResumeBuilder from "./pages/ResumeBuilder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* ADD THIS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/resume-result" element={<ResumeReport />} />
        <Route path="/view-report" element={<ViewReport />} />
        <Route path="/roadmap" element={<RoadmapGenerator />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/interview-session" element={<InterviewSession />} />
        <Route path="/interview-report" element={<InterviewReport />} />
        <Route path="/voice-interview-prep" element={<VoiceInterviewPrep />}/>
        <Route path="/voice-interview" element={<VoiceInterview />}/>
        <Route path="/voice-history" element={<VoiceInterviewHistory />}/>
        <Route path="/resume-builder" element={<ResumeBuilder />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;