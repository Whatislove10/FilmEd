// src/router.js
import { CinemaPage } from './components/CinemaPage.js';
import { CollectionPage } from './components/CollectionPage.js';
import { CommunityPage } from './components/CommunityPage.js';
import { HomePage } from './components/HomePage.js';
import { currentUserId } from './data.js';

const routes = {
    home: HomePage,
    cinema: CinemaPage,
    community: CommunityPage,
    collection: CollectionPage,
};

let currentPage = {};

export function navigate(page, params = {}) {
    currentPage = { page, params };
    const mainContent = document.getElementById('main-content');

    // Обновляем активную ссылку в навигации
    document.querySelectorAll('#main-nav a').forEach(link => {
        const isCollection = page === 'collection' && link.dataset.page === 'collection';
        link.classList.toggle('nav-link-active', link.dataset.page === page || isCollection);
    });

    // Рендерим нужную страницу
    const pageFunction = routes[page] || routes.home;
    if (page === 'cinema') {
        mainContent.innerHTML = pageFunction(params.videoId);
    } else if (page === 'collection') {
        mainContent.innerHTML = pageFunction(params.userId, params.category);
    } else {
        mainContent.innerHTML = pageFunction();
    }

    // Повторно инициализируем иконки
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

export function handleNavigation() {
    document.body.addEventListener('click', (e) => {
        const pageTarget = e.target.closest('[data-page]');
        const categoryTarget = e.target.closest('[data-category]');

        if (pageTarget) {
            e.preventDefault();
            const page = pageTarget.dataset.page;
            const videoId = pageTarget.dataset.videoId ? parseInt(pageTarget.dataset.videoId) : null;
            const userId = pageTarget.dataset.userId ? parseInt(pageTarget.dataset.userId) : null;
            navigate(page, { videoId, userId });
        } else if (categoryTarget && currentPage.page === 'collection') {
             e.preventDefault();
             const category = categoryTarget.dataset.category;
             const userId = currentPage.params.userId || currentUserId;
             navigate('collection', { userId, category });
        }
    });
}