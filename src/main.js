import { Header } from './components/Header.js';
import { navigate, handleNavigation } from './router.js';
import { currentUserId } from './data.js';

function initializeApp() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = Header(currentUserId);

    handleNavigation();

    navigate('home'); // Стартовая страница
}

document.addEventListener('DOMContentLoaded', initializeApp);