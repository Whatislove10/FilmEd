// ChallengePage.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, doc, getDoc, query, where, addDoc, updateDoc, onSnapshot } from "firebase/firestore";

interface Challenge {
  id: string;
  title: string;
  description: string;
  originalVideoUrl?: string;
}

interface Video {
  id: string;
  url: string;
  userId: string;
  votes: number;
  voters?: string[];
}

// Cinematic, neutral inline styles
const styles: any = {
  page: {
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    background: "linear-gradient(120deg, #1a1c23, #111315)",
    color: "#e0e0e0",
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
    alignItems: "center",
  },
  header: { textAlign: "center" },
  // Обновленные стили для заголовка и описания в стиле "Матрицы"
  title: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)", // Адаптивный размер шрифта
    fontWeight: "700",
    fontFamily: "'Share Tech Mono', monospace", // Моноширинный шрифт для эффекта кода
    color: "#00ff41", // Неоново-зеленый цвет
    textShadow: "0 0 10px rgba(0, 255, 65, 0.6)", // Свечение
    marginBottom: "0.5rem",
    letterSpacing: "0.05em",
  },
  description: {
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)", // Адаптивный размер шрифта
    color: "#00cc33", // Чуть более темный зеленый
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: 1.5,
    fontFamily: "'Share Tech Mono', monospace",
  },
  originalVideo: { width: "100%", maxWidth: "800px", borderRadius: "8px", boxShadow: "0 0 15px rgba(0, 255, 65, 0.3)" }, // Тень в стиле Матрицы
  uploadSection: { display: "flex", gap: "1rem", alignItems: "center" },
  fileInput: { 
    padding: "0.5rem 1rem", 
    borderRadius: "6px", 
    border: "1px solid #00cc33", 
    backgroundColor: "#0a1a0d", // Темный фон для кнопки
    color: "#00ff41", // Неоново-зеленый текст
    cursor: "pointer",
    transition: "all 0.3s ease",
    '&:hover': {
      backgroundColor: "#003300",
      boxShadow: "0 0 10px rgba(0, 255, 65, 0.5)",
    }
  },
  uploadButton: { 
    padding: "0.5rem 1.2rem", 
    borderRadius: "6px", 
    border: "none", 
    backgroundColor: "#00ff41", 
    color: "#111", 
    fontWeight: "600", 
    cursor: "pointer",
    transition: "all 0.3s ease",
    '&:hover': {
      backgroundColor: "#00e03a",
      boxShadow: "0 0 15px rgba(0, 255, 65, 0.8)",
    }
  },
  videoGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(4, 1fr)", 
    gap: "1.5rem", 
    width: "100%", 
    maxWidth: "1200px" ,
    '@media (max-width: 1024px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
    '@media (max-width: 600px)': { gridTemplateColumns: '1fr' }
  },
  videoCard: {
    backgroundColor: "#1a1a1a", // Темный фон для карточек
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    position: "relative",
    border: "1px solid #004400", // Зеленая рамка
    boxShadow: "0 4px 12px rgba(0,0,0,0.5), 0 0 8px rgba(0, 255, 65, 0.2)", // Мягкое зеленое свечение
  },
  videoPlayer: { width: "100%", borderRadius: "8px", marginBottom: "0.5rem" },
  voteInfo: { padding: "10px", display: "flex", flexDirection: "column", gap: "8px" },
  voteCount: { fontSize: "1rem", fontWeight: "600", color: "#00ff41" }, // Зеленый счетчик
  voteButton: { 
    padding: "0.5rem", 
    borderRadius: "6px", 
    border: "1px solid #00ff41", 
    color: "#00ff41", 
    backgroundColor: "transparent", 
    cursor: "pointer",
    transition: "all 0.3s ease",
    '&:hover': {
      backgroundColor: "rgba(0, 255, 65, 0.1)",
      boxShadow: "0 0 5px rgba(0, 255, 65, 0.5)",
    }
  },
  votedButton: { 
    padding: "0.5rem", 
    borderRadius: "6px", 
    border: "1px solid #008000", 
    color: "#fff", 
    backgroundColor: "#008000", 
    cursor: "default",
    boxShadow: "0 0 5px rgba(0, 255, 65, 0.3)",
  },
};

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dsk6odyv1/upload";
  const UPLOAD_PRESET = "FilmEdMVP";

  const [userId] = useState(() => {
    let uid = localStorage.getItem("uid");
    if (!uid) { uid = crypto.randomUUID(); localStorage.setItem("uid", uid); }
    return uid;
  });

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "challenges", id);
    getDoc(docRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Challenge;
        setChallenge({ ...data, id: docSnap.id, originalVideoUrl: data.originalVideoUrl || "https://res.cloudinary.com/dsk6odyv1/video/upload/v1701389279/example_video_original.mp4" });
      }
    });

    const q = query(collection(db, "videos"), where("challengeId", "==", id));
    const unsubscribe = onSnapshot(q, snapshot => {
      const vids: Video[] = [];
      snapshot.forEach(doc => vids.push({ ...(doc.data() as Video), id: doc.id, voters: (doc.data() as any).voters || [] }));
      // keep order static, limit to 4
      setVideos(vids.slice(0, 4));
    });
    return () => unsubscribe();
  }, [id]);

  const handleVote = async (videoId: string) => {
    const prevVote = videos.find(v => v.voters?.includes(userId));
    const newVote = videos.find(v => v.id === videoId);
    if (!newVote || prevVote?.id === videoId) return;

    try {
      if (prevVote) {
        const prevDocRef = doc(db, "videos", prevVote.id);
        await updateDoc(prevDocRef, { voters: prevVote.voters!.filter(v => v !== userId), votes: prevVote.votes - 1 });
      }
      const newDocRef = doc(db, "videos", newVote.id);
      await updateDoc(newDocRef, { voters: [...newVote.voters!, userId], votes: newVote.votes + 1 });
    } catch (err) { console.error(err); }
  };

  const handleUpload = async () => {
    if (!file || !id || isUploading) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");
      await addDoc(collection(db, "videos"), { challengeId: id, url: data.secure_url, userId, votes: 0, voters: [] });
      setFile(null);
    } catch (err) { console.error(err); } finally { setIsUploading(false); }
  };

  if (!challenge) return <div style={styles.page}>Loading challenge...</div>;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        {/* Обновленные надписи */}
        <h1 style={styles.title}>Matrix</h1>
        <p style={styles.description}>Neo must choose between the red pill and the blue pill. Recreate this iconic moment!</p>
      </header>

      {challenge.originalVideoUrl && <video src={challenge.originalVideoUrl} controls style={styles.originalVideo} />}

      <section style={styles.uploadSection}>
        <label style={styles.fileInput}>{file ? `Selected: ${file.name}` : "Select video"}<input type="file" accept="video/*" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] || null)} /></label>
        <button style={styles.uploadButton} onClick={handleUpload} disabled={!file || isUploading}>{isUploading ? "Uploading..." : "Upload"}</button>
      </section>

      <section style={{ width: "100%", maxWidth: "1200px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem", color: "#00ff41", textShadow: "0 0 5px rgba(0, 255, 65, 0.4)" }}>Community Recreations</h2>
        <div style={{...styles.videoGrid, gridTemplateColumns: window.innerWidth < 600 ? '1fr' : window.innerWidth < 900 ? '1fr 1fr' : 'repeat(4, 1fr)'}}>
          {videos.map(v => {
            const hasVoted = v.voters?.includes(userId);
            return (
              <div key={v.id} style={styles.videoCard}>
                <video src={v.url} controls style={styles.videoPlayer} />
                <div style={styles.voteInfo}>
                  <div style={styles.voteCount}>{v.votes} Votes</div>
                  <button style={hasVoted ? styles.votedButton : styles.voteButton} onClick={() => handleVote(v.id)}>{hasVoted ? "Your Vote" : "Vote"}</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}