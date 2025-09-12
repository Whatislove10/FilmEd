import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";

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
      snapshot.forEach((doc) => vids.push({ ...(doc.data() as Video), id: doc.id}));
      setVideos(vids);
    };

    fetchChallenge();
    fetchVideos();
  }, [id]);

  if (!challenge) return <div>Loading challenge...</div>;

  return (
  <div style={{ padding: 20 }}>
    <h1>{challenge.title}</h1>
    <p>{challenge.description}</p>

    <h3>Requirements:</h3>
    <ul>
      {challenge.requirements.map((r, idx) => (
        <li key={idx}>{r}</li>
      ))}
    </ul>

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
