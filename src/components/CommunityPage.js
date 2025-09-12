import { db } from '../data.js';

export const CommunityPage = () => {
    // Инициализация голосов
    const votes = {};
    let voted = false; // можно голосовать только один раз

    const originalVideo = db.videos.find(v => v.id === 101);
    const parodyVideos = db.videos.filter(v => [102, 103, 104, 105].includes(v.id));

    const renderVideoCard = (video) => {
        const videoId = video.id;
        const user = db.users[video.userId];

        if (!(videoId in votes)) votes[videoId] = 0;

        const container = document.createElement('div');
        container.className = 'bg-[#3a3f44] rounded-lg shadow-lg p-3 m-2 text-center';
        container.id = `video-${videoId}`;

        // Видео
        const videoEl = document.createElement('video');
        videoEl.src = video.thumbnail.replace('400/225', '480/270'); // для демонстрации используем thumbnail
        videoEl.controls = true;
        videoEl.className = 'rounded mb-2 w-full';
        container.appendChild(videoEl);

        // Заголовок
        const titleEl = document.createElement('h3');
        titleEl.textContent = video.title;
        titleEl.className = 'text-white font-semibold mb-1';
        container.appendChild(titleEl);

        // Автор
        const authorEl = document.createElement('p');
        authorEl.textContent = `by ${user.name}`;
        authorEl.className = 'text-gray-400 text-xs mb-1';
        container.appendChild(authorEl);

        // Описание
        const descEl = document.createElement('p');
        descEl.textContent = video.description;
        descEl.className = 'text-gray-300 text-xs mb-2';
        container.appendChild(descEl);

        // Кнопка голосования
        const voteBtn = document.createElement('button');
        voteBtn.textContent = 'Vote';
        voteBtn.className = 'vote-btn bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded';
        container.appendChild(voteBtn);

        // Голоса
        const voteCount = document.createElement('div');
        voteCount.className = 'mt-2 text-gray-200';
        voteCount.innerHTML = `Votes: <span id="votes-${videoId}">${votes[videoId]}</span>`;
        container.appendChild(voteCount);

        // Обработчик кнопки
        voteBtn.addEventListener('click', () => {
            if (voted) return;
            votes[videoId]++;
            document.getElementById(`votes-${videoId}`).textContent = votes[videoId];
            voted = true;
            // блокируем все кнопки
            document.querySelectorAll('.vote-btn').forEach(btn => {
                btn.disabled = true;
                btn.classList.add('bg-gray-600', 'cursor-not-allowed');
            });
        });

        return container;
    };

    // Основной контейнер страницы
    const pageContainer = document.createElement('div');
    pageContainer.className = 'bg-[#2a2e33] p-6 rounded-lg max-w-5xl mx-auto space-y-8';

    // Оригинал
    const originalTitle = document.createElement('h2');
    originalTitle.textContent = 'Original Video';
    originalTitle.className = 'text-3xl text-white font-bold text-center mb-6';
    pageContainer.appendChild(originalTitle);

    const originalWrapper = document.createElement('div');
    originalWrapper.className = 'flex justify-center';
    originalWrapper.appendChild(renderVideoCard(originalVideo));
    pageContainer.appendChild(originalWrapper);

    // Пародии
    const parodyTitle = document.createElement('h2');
    parodyTitle.textContent = 'Parody Videos';
    parodyTitle.className = 'text-3xl text-white font-bold text-center mb-6';
    pageContainer.appendChild(parodyTitle);

    const parodyGrid = document.createElement('div');
    parodyGrid.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center';
    parodyVideos.forEach(video => parodyGrid.appendChild(renderVideoCard(video)));
    pageContainer.appendChild(parodyGrid);

    return pageContainer.outerHTML;
};