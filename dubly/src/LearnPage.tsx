import React from "react";

export default function LearnPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>📚 Обучение</h1>
      <p>Здесь собраны обучающие материалы:</p>

      <h2>🎥 Видеоуроки</h2>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video"
        allowFullScreen
      ></iframe>

      <h2>📄 Статьи</h2>
      <ul>
        <li>Как снимать видео с телефона</li>
        <li>Основы монтажа</li>
        <li>Свет и звук в домашних условиях</li>
      </ul>
    </div>
  );
}
