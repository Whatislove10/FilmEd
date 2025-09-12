// src/main.js
import { Header } from './components/Header.js';
import { navigate, handleNavigation } from './router.js';
import { currentUserId } from './data.js';

// Главная функция для инициализации приложения
function initializeApp() {
    const appElement = document.getElementById('app');

    // Рендерим постоянные части интерфейса, например, шапку
    appElement.innerHTML = Header(currentUserId);

    // Настраиваем роутер и обработчики событий
    handleNavigation();

    // Переходим на начальную страницу
    navigate('cinema', { videoId: 101 });
}

// Ждём полной загрузки DOM перед запуском приложения
document.addEventListener('DOMContentLoaded', initializeApp);