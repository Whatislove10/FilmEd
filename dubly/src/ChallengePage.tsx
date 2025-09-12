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
  onSnapshot
} from "firebase/firestore";

interface Challenge {
  id: string;
  title: string;
  description: string;
  requirements: string[];
}

interface Video {
  id: string;
  url: string;
  userId: string;
  votes: number;
  voters?: string[];
}

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dsk6odyv1/upload"; // замените <your-cloud-name>
  const UPLOAD_PRESET = "FilmEdMVP"; // имя unsigned preset

  // Уникальный ID для пользователя
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

    // Получаем challenge
    const docRef = doc(db, "challenges", id);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setChallenge({ ...(docSnap.data() as Challenge), id: docSnap.id });
      }
    });

    // Подписка на видео в реальном времени
    const q = query(collection(db, "videos"), where("challengeId", "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vids: Video[] = [];
      snapshot.forEach((doc) =>
        vids.push({ ...(doc.data() as Video), id: doc.id, voters: (doc.data() as any).voters || [] })
      );
      setVideos(vids);
    });

    return () => unsubscribe();
  }, [id]);

  const handleVote = async (videoId: string) => {
    const prevVote = videos.find(v => v.voters?.includes(userId));
    const newVote = videos.find(v => v.id === videoId);

    if (!newVote) return;
    if (prevVote?.id === videoId) return;

    try {
      if (prevVote) {
        const prevDocRef = doc(db, "videos", prevVote.id);
        await updateDoc(prevDocRef, {
          voters: prevVote.voters!.filter(v => v !== userId),
          votes: prevVote.votes - 1
        });
      }

      const newDocRef = doc(db, "videos", newVote.id);
      await updateDoc(newDocRef, {
        voters: [...newVote.voters!, userId],
        votes: newVote.votes + 1
      });

      // onSnapshot автоматически обновит локальный стейт

    } catch (error) {
      console.error("Ошибка голосования:", error);
    }
  };

  const handleUpload = async () => {
    if (!file || !id) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      const url = data.secure_url;

      if (!url) throw new Error("Ошибка получения URL видео");

      // Сохраняем URL в Firestore
      await addDoc(collection(db, "videos"), {
        challengeId: id,
        url,
        userId,
        votes: 0,
        voters: []
      });

      alert("Видео загружено!");
      setFile(null);

    } catch (error) {
      console.error("Ошибка загрузки видео:", error);
    }
  };

  if (!challenge) return <div>Loading challenge...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{challenge.title}</h1>
      <p>{challenge.description}</p>

      <h3>Upload your video:</h3>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>

      <h3>Submitted videos:</h3>
      {videos.length === 0 ? (
        <p>No videos submitted yet.</p>
      ) : (
        videos.map((v) => {
          const hasVoted = v.voters?.includes(userId);
          return (
            <div key={v.id} style={{ marginBottom: 20 }}>
              <video src={v.url} controls width={400} style={{ display: "block" }} />
              <p>Votes: {v.votes}</p>
              <button
                onClick={() => handleVote(v.id)}
                style={{ backgroundColor: hasVoted ? "green" : "lightgray" }}
              >
                {hasVoted ? "Your Vote" : "Vote for this video"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
