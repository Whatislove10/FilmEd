import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, doc, getDoc, query, where, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
}

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dsk6odyv1/upload"; // замените <your-cloud-name>
  const UPLOAD_PRESET = "FilmEdMVP"; // имя unsigned preset

  useEffect(() => {
    if (!id) return;

    const fetchChallenge = async () => {
      const docRef = doc(db, "challenges", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setChallenge({ ...(docSnap.data() as Challenge), id: docSnap.id });
      }
    };

    const fetchVideos = async () => {
      const q = query(collection(db, "videos"), where("challengeId", "==", id));
      const snapshot = await getDocs(q);
      const vids: Video[] = [];
      snapshot.forEach((doc) =>
        vids.push({ ...(doc.data() as Video), id: doc.id })
      );
      setVideos(vids);
    };

    fetchChallenge();
    fetchVideos();
  }, [id]);

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
        userId: "testUser", // TODO: заменить на реального пользователя
        votes: 0,
      });

      alert("Видео загружено!");
      setFile(null);

      // Обновим список
      const q = query(collection(db, "videos"), where("challengeId", "==", id));
      const snapshot = await getDocs(q);
      const vids: Video[] = [];
      snapshot.forEach((doc) =>
        vids.push({ ...(doc.data() as Video), id: doc.id })
      );
      setVideos(vids);

    } catch (error) {
      console.error("Ошибка загрузки видео:", error);
    }
  };

  if (!challenge) return <div>Loading challenge...</div>;

return (
  <div style={{ padding: 20 }}>
    <h1>{challenge.title}</h1>
    <p>{challenge.description}</p>

    <h2>🔥 DEBUG: This is ChallengePage rendering</h2>

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
      <>
        {videos.map((v) => (
          <video
            key={v.id}
            src={v.url}
            controls
            width={400}
            style={{ display: "block", marginBottom: 10 }}
          />
        ))}
      </>
    )}
  </div>
);
}
