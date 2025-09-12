// ChallengePage.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

interface Challenge {
  id: string;
  title: string;
  description: string;
  originalVideoUrl?: string; // YouTube link
}

interface Video {
  id: string;
  url: string;
  userId: string;
  votes: number;
  voters?: string[];
}

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
  title: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: "700",
    fontFamily: "'Share Tech Mono', monospace",
    color: "#00ff41",
    textShadow: "0 0 10px rgba(0, 255, 65, 0.6)",
    marginBottom: "0.5rem",
    letterSpacing: "0.05em",
  },
  description: {
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    color: "#00cc33",
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: 1.5,
    fontFamily: "'Share Tech Mono', monospace",
  },
  videoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "1200px",
  },
  videoCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    position: "relative",
    border: "1px solid #004400",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5), 0 0 8px rgba(0, 255, 65, 0.2)",
  },
  videoPlayer: { width: "100%", borderRadius: "8px", marginBottom: "0.5rem" },
  voteInfo: { padding: "10px", display: "flex", flexDirection: "column", gap: "8px" },
  voteCount: { fontSize: "1rem", fontWeight: "600", color: "#00ff41" },
  voteButton: {
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #00ff41",
    color: "#00ff41",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  votedButton: {
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #008000",
    color: "#fff",
    backgroundColor: "#008000",
    cursor: "default",
  },
  uploadSection: { display: "flex", gap: "1rem", alignItems: "center" },
  fileInput: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "1px solid #00cc33",
    backgroundColor: "#0a1a0d",
    color: "#00ff41",
    cursor: "pointer",
  },
  uploadButton: {
    padding: "0.5rem 1.2rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#00ff41",
    color: "#111",
    fontWeight: "600",
    cursor: "pointer",
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
    if (!uid) {
      uid = crypto.randomUUID();
      localStorage.setItem("uid", uid);
    }
    return uid;
  });

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "challenges", id);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Challenge;
        setChallenge({ ...data, id: docSnap.id });
      }
    });

    const q = query(collection(db, "videos"), where("challengeId", "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vids: Video[] = [];
      snapshot.forEach((doc) =>
        vids.push({
          ...(doc.data() as Video),
          id: doc.id,
          voters: (doc.data() as any).voters || [],
        })
      );
      setVideos(vids.slice(0, 4));
    });
    return () => unsubscribe();
  }, [id]);

  const handleVote = async (videoId: string) => {
    const prevVote = videos.find((v) => v.voters?.includes(userId));
    const newVote = videos.find((v) => v.id === videoId);
    if (!newVote || prevVote?.id === videoId) return;

    try {
      if (prevVote) {
        const prevDocRef = doc(db, "videos", prevVote.id);
        await updateDoc(prevDocRef, {
          voters: prevVote.voters!.filter((v) => v !== userId),
          votes: prevVote.votes - 1,
        });
      }
      const newDocRef = doc(db, "videos", newVote.id);
      await updateDoc(newDocRef, {
        voters: [...newVote.voters!, userId],
        votes: newVote.votes + 1,
      });
    } catch (err) {
      console.error(err);
    }
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
      await addDoc(collection(db, "videos"), {
        challengeId: id,
        url: data.secure_url,
        userId,
        votes: 0,
        voters: [],
      });
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    let videoId: string | null = null;
    try {
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("watch?v=")) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v");
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("/embed/")[1].split("?")[0];
      }
      if (videoId) {
        const origin = window.location.origin;
        return `https://www.youtube.com/embed/${videoId}?origin=${encodeURIComponent(origin)}&modestbranding=1&rel=0&playsinline=1`;
      }
      return null;
    } catch (error) {
      console.error("Error parsing YouTube URL:", error);
      return null;
    }
  };

  if (!challenge) return <div style={styles.page}>Loading challenge...</div>;

  const embedUrl = getYouTubeEmbedUrl(challenge.originalVideoUrl);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Matrix</h1>
        <p style={styles.description}>
          Neo must choose between the red pill and the blue pill. Recreate this iconic moment!
        </p>
      </header>

      {embedUrl && (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "800px",
            paddingTop: "56.25%",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 0 15px rgba(0, 255, 65, 0.3)",
          }}
        >
          <iframe
            src={embedUrl}
            title="Challenge Original Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          ></iframe>
        </div>
      )}

      <section style={styles.uploadSection}>
        <label style={styles.fileInput}>
          {file ? `Selected: ${file.name}` : "Select video"}
          <input
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <button
          style={styles.uploadButton}
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </section>

      <section style={{ width: "100%", maxWidth: "1200px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "2rem",
            marginBottom: "1rem",
            color: "#00ff41",
            textShadow: "0 0 5px rgba(0, 255, 65, 0.4)",
          }}
        >
          Community Recreations
        </h2>
        <div
          style={{
            ...styles.videoGrid,
            gridTemplateColumns:
              window.innerWidth < 600
                ? "1fr"
                : window.innerWidth < 900
                ? "1fr 1fr"
                : "repeat(4, 1fr)",
          }}
        >
          {videos.map((v) => {
            const hasVoted = v.voters?.includes(userId);
            return (
              <div key={v.id} style={styles.videoCard}>
                <video src={v.url} controls style={styles.videoPlayer} />
                <div style={styles.voteInfo}>
                  <div style={styles.voteCount}>{v.votes} Votes</div>
                  <button
                    style={hasVoted ? styles.votedButton : styles.voteButton}
                    onClick={() => handleVote(v.id)}
                  >
                    {hasVoted ? "Your Vote" : "Vote"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}