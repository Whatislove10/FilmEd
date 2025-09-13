// App.tsx

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChallengePage from "./ChallengePage";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import LearnPage from "./LearnPage";
import ProfilePage from "./ProfilePage";
import FeedPage from "./FeedPage";
import AboutPage from "./AboutPage";
import TeamPage from "./TeamPage";
import { Header } from "./components/Header";

interface Challenge {
  id: string;
  title: string;
  description: string;
  originalVideoUrl?: string;
  status: "upcoming" | "active" | "ended";
  winner?: string;
}

export default function App() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const snapshot = await getDocs(collection(db, "challenges"));
      const arr: Challenge[] = [];
      snapshot.forEach((doc) => arr.push({ ...(doc.data() as Challenge), id: doc.id }));
      setChallenges(arr);
    };
    fetchChallenges();
  }, []);

  // Этот компонент тоже стоит вынести в отдельный файл и стилизовать через Tailwind
  const ChallengesList = () => (
    <>
      <h2 className="text-3xl font-bold tracking-tight mb-8 pb-4 border-b">Challenges</h2>
      {challenges.length === 0 ? (
        <p className="text-center text-muted-foreground">No challenges yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map(c => (
            // Для карточек можно будет использовать компонент Card от shadcn
            <div
              key={c.id}
              className="border bg-card text-card-foreground rounded-lg p-6 flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
              <p className="text-muted-foreground flex-grow mb-4">{c.description}</p>
              <Link
                to={`/challenge/${c.id}`}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 self-start"
              >
                Go to challenge
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <Router>
      {/* Используем Tailwind для основного контейнера */}
      <div className="min-h-screen font-sans antialiased">
        <Header /> {/* <-- Вот наш новый навбар! */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ChallengesList />} />
            <Route path="/challenge/:id" element={<ChallengePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}