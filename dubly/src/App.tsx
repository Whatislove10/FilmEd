// App.tsx

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChallengePage from "./ChallengePage";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import './Navbar.css'; // <-- 1. Импортируем новый CSS-файл

interface Challenge {
  id: string;
  title: string;
  description: string;
  originalVideoUrl?: string;
}

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
    display: 'flex',
    alignItems: 'center',
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
    textDecoration: 'none',
  },
  userProfile: {
    color: '#e0e0e0',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userAvatar: {
    width: '30px', height: '30px', borderRadius: '50%',
    backgroundColor: '#50a5f1', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
    color: '#1e2128', fontSize: '0.9rem',
  },
  mainContent: {
    padding: '40px', maxWidth: '1280px', width: '100%',
    margin: '0 auto', boxSizing: 'border-box', flexGrow: 1,
  },
  pageTitle: {
    fontSize: '2.5rem', borderBottom: '1px solid #4a4f58',
    paddingBottom: '15px', marginBottom: '30px',
  },
  challengeGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
  },
  challengeCard: {
    backgroundColor: '#282c34', border: '1px solid #4a4f58', borderRadius: '8px',
    padding: '20px', display: 'flex', flexDirection: 'column',
    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
  },
  challengeTitle: {
    fontSize: '1.5rem', fontWeight: 600, color: '#e0e0e0', marginBottom: '10px',
  },
  challengeDescription: {
    color: '#8a919f', flexGrow: 1, marginBottom: '20px',
  },
  challengeLink: {
    display: 'inline-block', textAlign: 'center', backgroundColor: 'transparent',
    border: '1px solid #50a5f1', color: '#50a5f1', padding: '10px 15px',
    borderRadius: '6px', fontWeight: 500, alignSelf: 'flex-start',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
} as const;

export default function App() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  // <-- 2. Добавляем состояние для управления мобильным меню -->
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <div key={c.id} style={styles.challengeCard}>
              <h3 style={styles.challengeTitle}>{c.title}</h3>
              <p style={styles.challengeDescription}>{c.description}</p>
              <Link to={`/challenge/${c.id}`} style={styles.challengeLink}>
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
        {/* <-- 3. Добавляем оверлей, который появляется вместе с меню --> */}
        {isMobileMenuOpen && <div className="overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

        <header style={styles.header} className="main-header">
          <div style={styles.logo}>
            <i className="fas fa-film icon-blue"></i> FilmEd
          </div>
          
          {/* <-- 4. Оборачиваем десктопную навигацию в div с классом --> */}
          <nav style={styles.nav} className="desktop-nav">
            <Link to="/" style={styles.navLink}><i className="fas fa-home icon"></i> Home</Link>
            <span style={styles.navLink}><i className="fas fa-users icon"></i> Community</span>
            <span style={styles.navLink}><i className="fas fa-trophy icon"></i> Challenges</span>
          </nav>

          <div style={styles.userProfile}>
            <div style={styles.userAvatar}>P</div>
            {/* <-- 5. Оборачиваем текст юзера в span с классом --> */}
            <span className="desktop-username">User</span>
          </div>

          {/* <-- 6. Добавляем кнопку "бургера", которая видна только на мобильных --> */}
          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
          </button>
        </header>
        
        {/* <-- 7. Добавляем само мобильное меню --> */}
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" style={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}><i className="fas fa-home icon"></i> Home</Link>
            <span style={styles.navLink}><i className="fas fa-users icon"></i> Community</span>
            <span style={styles.navLink}><i className="fas fa-trophy icon"></i> Challenges</span>
            <span style={styles.navLink}><i className="fas fa-folder icon"></i> Collection</span>
        </nav>
        
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