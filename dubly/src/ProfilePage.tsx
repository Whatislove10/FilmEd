import React from "react";

export default function ProfilePage() {
  const fakeVideos = [
    { id: 1, url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4", votes: 12 },
    { id: 2, url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4", votes: 30 },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>👤 Мой профиль</h1>
      <p>Имя: TestUser</p>
      <p>Побед в челленджах: 1</p>
      <p>Дней подряд онлайн: 7</p>

      <h2>🏅 Бейджики</h2>
      <ul>
        <li>🏆 Победитель</li>
        <li>🔥 Постоянный пользователь (7 дней)</li>
        <li>🎥 Первая работа</li>
      </ul>

      <h2>🎬 Мои работы</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
        {fakeVideos.map((v) => (
          <video key={v.id} src={v.url} controls width="100%" />
        ))}
      </div>
    </div>
  );
}
