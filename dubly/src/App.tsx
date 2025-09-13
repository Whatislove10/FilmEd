import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChallengePage from "./ChallengePage";
import LearnPage from "./LearnPage";
import ProfilePage from "./ProfilePage";
import FeedPage from "./FeedPage";
import TeamPage from "./TeamPage";
import { Header } from "./components/Header";
import HomePage from "./HomePage";
import ChallengesListPage from "./ChallengesListPage";
import AboutPage from "./AboutPage"; // Убедитесь, что импорт есть

export default function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans antialiased">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/challenges" element={<ChallengesListPage />} />
            <Route path="/challenge/:id" element={<ChallengePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/about" element={<AboutPage />} /> {/* <-- ВОТ ИСПРАВЛЕНИЕ */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}