import React from "react";

export default function FeedPage() {
  const feedVideos = [
    "https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4",
    "https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4",
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎥 Лента</h1>
      <p>Случайные видео пользователей:</p>
      {feedVideos.map((url, i) => (
        <video key={i} src={url} controls width="400" style={{ display: "block", margin: "1rem auto" }} />
      ))}
    </div>
  );
}
