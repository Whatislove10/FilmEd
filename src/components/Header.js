import { db } from '../data.js';

export const Header = (userId) => {
    const user = db.users[userId];

    const headerHTML = `
        <header class="flex justify-between items-center mb-6">
            <div class="flex items-center space-x-8">
                <div class="flex items-center justify-center w-8 h-8 bg-gray-700/50 rounded-md">
                    <i data-lucide="film" class="w-5 h-5 text-gray-400"></i>
                </div>
                <nav class="hidden md:flex items-center space-x-6 text-gray-400" id="main-nav">
                    <a href="#" class="hover:text-white transition-colors pb-1" data-page="home">Home</a>
                    <a href="#" class="hover:text-white transition-colors pb-1" data-page="community">Community</a>
                </nav>
            </div>
            <div id="user-header" class="flex items-center space-x-4">
                <div class="text-right">
                    <div class="font-semibold text-white">${user.name}</div>
                    <div class="text-xs text-gray-400">lvl ${user.level}</div>
                </div>
                <button class="p-2 rounded-full hover:bg-gray-700/50 transition-colors">
                     <img src="${user.avatar}" alt="User Avatar" class="w-8 h-8 rounded-full border-2 border-gray-600">
                </button>
            </div>
        </header>
        <main id="main-content"></main>
    `;
    return headerHTML;
};