import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChallengePage from "./ChallengePage";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

interface Challenge {
  id: string;
  title: string;
  description: string;
  requirements?: string[];
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

  return (
    <Router>
      <div style={{ padding: 20 }}>
        <h1>FilmEd MVP</h1>
        <Routes>
          <Route path="/" element={
            <>
              <h2>Challenges</h2>
              {challenges.length === 0 ? (
                <p>No challenges yet</p>
              ) : (
                challenges.map(c => (
                  <div key={c.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                    <Link to={`/challenge/${c.id}`}>Go to challenge</Link>
                  </div>
                ))
              )}
            </>
          }/>
          <Route path="/challenge/:id" element={<ChallengePage />} />
        </Routes>
      </div>
    </Router>
  );
}
