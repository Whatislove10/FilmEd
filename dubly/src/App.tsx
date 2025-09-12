// App.tsx

import { useEffect, useState } from "react"; // 'React' удален
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChallengePage from "./ChallengePage";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

interface Challenge {
  id: string;
  title: string;
  description: string;
  originalVideoUrl?: string;
}

// Стили для App компонента
const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#282c34',
    padding: '10px 40px',
    borderBottom: '1px solid #4a4f58',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#e0e0e0',
  },
  nav: {
    display: 'flex',
    gap: '25px',
  },
  navLink: {
    color: '#8a919f',
    fontWeight: 500,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  userProfile: {
    color: '#e0e0e0',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#50a5f1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#1e2128',
    fontSize: '0.9rem',
  },
  settingsIcon: {
    marginLeft: '10px',
    color: '#8a919f',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  mainContent: {
    padding: '40px',
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
    flexGrow: 1,
  },
  pageTitle: {
    fontSize: '2.5rem',
    borderBottom: '1px solid #4a4f58',
    paddingBottom: '15px',
    marginBottom: '30px',
  },
  challengeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
  },
  challengeCard: {
    backgroundColor: '#282c34',
    border: '1px solid #4a4f58',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
  },
  challengeCardHover: {
    transform: 'translateY(-5px)',
    borderColor: '#50a5f1',
    boxShadow: '0 5px 15px rgba(80, 165, 241, 0.2)',
  },
  challengeTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '10px',
  },
  challengeDescription: {
    color: '#8a919f',
    flexGrow: 1,
    marginBottom: '20px',
  },
  challengeLink: {
    display: 'inline-block',
    textAlign: 'center',
    backgroundColor: 'transparent',
    border: '1px solid #50a5f1',
    color: '#50a5f1',
    padding: '10px 15px',
    borderRadius: '6px',
    fontWeight: 500,
    alignSelf: 'flex-start',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
  challengeLinkHover: {
    backgroundColor: '#50a5f1',
    color: '#1e2128',
  },
} as const; // <-- ИСПРАВЛЕНИЕ: Добавляем 'as const'

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

  const ChallengesList = () => (
    <>
      <h2 style={styles.pageTitle}>Challenges</h2>
      {challenges.length === 0 ? (
        <p style={{textAlign: 'center', color: styles.challengeDescription.color}}>No challenges yet</p>
      ) : (
        <div style={styles.challengeGrid}>
          {challenges.map(c => (
            <div
              key={c.id}
              style={styles.challengeCard}
              onMouseEnter={e => Object.assign(e.currentTarget.style, styles.challengeCardHover)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, styles.challengeCard)}
            >
              <h3 style={styles.challengeTitle}>{c.title}</h3>
              <p style={styles.challengeDescription}>{c.description}</p>
              <Link
                to={`/challenge/${c.id}`}
                style={styles.challengeLink}
                onMouseEnter={e => Object.assign(e.currentTarget.style, styles.challengeLinkHover)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, styles.challengeLink)}
              >
                <i className="fas fa-arrow-right icon"></i> Go to challenge
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <Router>
      <div style={styles.appContainer}>
       <header style={styles.header}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <img
      src="/logo_sample_hakathon_2.png"
      alt="Lotto Logo"
      style={{ height: '40px', width: 'auto' }}
    />
    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e0e0e0' }}>Filmit</span>
  </div>
  <nav style={styles.nav}>
    <Link to="/" style={styles.navLink}><i className="fas fa-home icon"></i> Home</Link>
    <span style={styles.navLink}><i className="fas fa-trophy icon"></i> Challenges</span>
  </nav>
  <div style={styles.userProfile}>
    <div style={styles.userAvatar}>U</div>
    User
    <i className="fas fa-cog icon" style={styles.settingsIcon}></i>
  </div>
</header>
        <main style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<ChallengesList />} />
            <Route path="/challenge/:id" element={<ChallengePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}