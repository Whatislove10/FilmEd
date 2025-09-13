import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import {
  collection,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import useMatrixBackground from "./MatrixBackground";

// --- Interfaces ---
interface Challenge {
  id: string;
  title: string;
  description: string;
  originalVideoUrl?: string;
  status: "upcoming" | "active" | "ended";
  winner?: string;
}

interface Video {
  id: string;
  url: string;
  userId: string;
  votes: number;
  voters?: string[];
}

// --- Styles (using inline for this specific page theme) ---
const styles: any = {
  page: {
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
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
    color: "#00ff41",
    textShadow: "0 0 10px rgba(0, 255, 65, 0.6)",
    marginBottom: "0.5rem",
    letterSpacing: "0.05em",
  },
  description: {
    fontSize: "clamp(1rem,2.5vw,1.2rem)",
    color: "#00cc33",
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: 1.5,
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
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.5), 0 0 8px rgba(0,255,65,0.2)",
  },
  videoPlayer: {
    width: "100%",
    borderRadius: "8px",
    marginBottom: "0.5rem",
  },
  voteInfo: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  voteCount: { fontSize: "1rem", fontWeight: "600", color: "#0f0" },
  voteButton: {
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #0f0",
    color: "#0f0",
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
  uploadSection: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  fileInput: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "1px solid #0f0",
    backgroundColor: "#0a1a0d",
    color: "#0f0",
    cursor: "pointer",
  },
  uploadButton: {
    padding: "0.5rem 1.2rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#0f0",
    color: "#111",
    fontWeight: "600",
    cursor: "pointer",
  },
};

// --- Component ---
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

  // *** KEY CHANGE IS HERE ***
  // We determine if the matrix should be active based on the challenge title.
  // The '?? false' handles the initial state when 'challenge' is still null.
  const isMatrixChallenge = challenge?.title.toLowerCase().includes("matrix") ?? false;
  
  // The hook now activates conditionally.
  useMatrixBackground(isMatrixChallenge);

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "challenges", id);
    const unsubscribeChallenge = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            setChallenge({
                ...(docSnap.data() as Challenge),
                id: docSnap.id,
            });
        }
    });

    const q = query(collection(db, "videos"), where("challengeId", "==", id));
    const unsubscribeVideos = onSnapshot(q, (snapshot) => {
      const vids: Video[] = [];
      snapshot.forEach((doc) =>
        vids.push({
          ...(doc.data() as Video),
          id: doc.id,
          voters: (doc.data() as any).voters || [],
        })
      );
      setVideos(vids);
    });
    
    return () => {
        unsubscribeChallenge();
        unsubscribeVideos();
    };
  }, [id]);

  const handleVote = async (videoId: string) => {
    if (!challenge || challenge.status !== "active") return;
    const prevVote = videos.find((v) => v.voters?.includes(userId));
    const newVote = videos.find((v) => v.id === videoId);
    if (!newVote || prevVote?.id === videoId) return;

    try {
      if (prevVote)
        await updateDoc(doc(db, "videos", prevVote.id), {
          voters: prevVote.voters!.filter((v) => v !== userId),
          votes: prevVote.votes - 1,
        });
      await updateDoc(doc(db, "videos", newVote.id), {
        voters: [...newVote.voters!, userId],
        votes: newVote.votes + 1,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file || !id || isUploading || !challenge || challenge.status !== "active")
      return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
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
      if (url.includes("youtu.be/"))
        videoId = url.split("youtu.be/")[1].split("?")[0];
      else if (url.includes("watch?v="))
        videoId = new URL(url).searchParams.get("v");
      else if (url.includes("youtube.com/embed/"))
        videoId = url.split("/embed/")[1].split("?")[0];
      if (videoId)
        return `https://www.youtube.com/embed/${videoId}?origin=${encodeURIComponent(
          window.location.origin
        )}&modestbranding=1&rel=0&playsinline=1`;
      return null;
    } catch {
      return null;
    }
  };

  if (!challenge) return <div style={styles.page}>Loading challenge...</div>;
  const embedUrl = getYouTubeEmbedUrl(challenge.originalVideoUrl);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>{challenge.title}</h1>
        <p style={styles.description}>{challenge.description}</p>
      </header>

      {embedUrl && (
        <div style={{ position: "relative", width: "100%", maxWidth: "800px", paddingTop: "56.25%", borderRadius: "8px", overflow: "hidden", boxShadow: "0 0 15px rgba(0,255,65,0.3)" }}>
          <iframe src={embedUrl} title="Challenge Original Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}></iframe>
        </div>
      )}

      {challenge.status === "upcoming" && (
        <div style={{ textAlign: "center" }}>
          <p>This challenge has not started yet.</p>
          <button style={styles.uploadButton}>🔔 Notify Me</button>
        </div>
      )}

      {challenge.status === "active" && (
        <section style={styles.uploadSection}>
          <label style={styles.fileInput}>
            {file ? `Selected: ${file.name}` : "Select video"}
            <input type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <button style={styles.uploadButton} onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </section>
      )}

      {challenge.status === "ended" && (
        <div style={{ textAlign: "center" }}>
          <p>Challenge Ended ✅</p>
          {videos.length > 0 &&
            (() => {
              const winner = videos.reduce((a, b) => (b.votes > a.votes ? b : a));
              return (
                <div>
                  <p style={{ color: "#0f0", fontWeight: "bold" }}>🏆 Winner: Video {winner.id} ({winner.votes} votes)</p>
                  <video src={winner.url} controls playsInline style={{ width: "100%", maxWidth: "600px", marginTop: "1rem", border: "2px solid #0f0", borderRadius: "8px" }}></video>
                </div>
              );
            })()}
        </div>
      )}

      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem", color: "#0f0", textShadow: "0 0 5px rgba(0,255,65,0.4)" }}>
    Community Recreations
  </h2>
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        videos.length === 2
          ? "1fr 1fr"
          : window.innerWidth < 600
          ? "1fr"
          : "repeat(4,1fr)",
      gap: "1.5rem",
      justifyContent: "center",
      width: "100%",
    }}
  >
    {videos.map((v) => {
      const hasVoted = v.voters?.includes(userId);

      const handleVideoPlay = (videoEl: HTMLVideoElement | null) => {
        if (!videoEl) return;
        const allVideos = document.querySelectorAll<HTMLVideoElement>("video");
        allVideos.forEach((vid) => {
          if (vid !== videoEl) vid.pause();
        });
      };

      return (
        <div key={v.id} style={styles.videoCard}>
          <video
            src={v.url}
            controls
            style={styles.videoPlayer}
            onPlay={(e) => handleVideoPlay(e.currentTarget)}
          ></video>
          <div style={styles.voteInfo}>
            <div style={styles.voteCount}>{v.votes} Votes</div>
            {challenge.status === "active" ? (
              <button
                style={hasVoted ? styles.votedButton : styles.voteButton}
                onClick={() => handleVote(v.id)}
              >
                {hasVoted ? "Your Vote" : "Vote"}
              </button>
            ) : (
              <div style={{ color: "#888" }}>Voting unavailable</div>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>
);
}