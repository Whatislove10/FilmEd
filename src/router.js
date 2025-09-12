import { HomePage } from './components/HomePage.js';
import { CommunityPage } from './components/CommunityPage.js';

const routes = {
    home: HomePage,
    community: CommunityPage,
};

let currentPage = {};

export function navigate(page) {
    currentPage.page = page;
    const mainContent = document.getElementById('main-content');
    const pageFunction = routes[page] || routes.home;
    mainContent.innerHTML = pageFunction();

    document.querySelectorAll('#main-nav a').forEach(link => {
        link.classList.toggle('nav-link-active', link.dataset.page === page);
    });

    if (window.lucide) window.lucide.createIcons();
}

export function handleNavigation() {
    document.body.addEventListener('click', (e) => {
        const pageTarget = e.target.closest('[data-page]');
        if (pageTarget) {
            e.preventDefault();
            navigate(pageTarget.dataset.page);
        }
    });
}