// src/components/CollectionPage.js
import { db, currentUserId } from '../data.js';

export const CollectionPage = (userId = currentUserId, category = 'all') => {
    const user = db.users[userId];
    const userVideos = db.videos.filter(v => v.userId === userId && (category === 'all' || v.category === category));
    const socialButtons = user.social ? Object.entries(user.social).map(([key, value]) => `<a href="${value}" target="_blank" class="bg-gray-700/60 hover:bg-gray-700 p-2 rounded-md uppercase text-xs font-bold">${key}</a>`).join('') : '';

    return `
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div class="lg:col-span-3">
                <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <h2 class="text-2xl font-bold text-white">${user.portfolioTitle}</h2>
                    ${user.views ? `<div class="flex space-x-4 text-sm"><span><i class="inline-block w-4 h-4" data-lucide="eye"></i> ${user.views.toLocaleString()}</span><span><i class="inline-block w-4 h-4" data-lucide="play"></i> ${user.plays.toLocaleString()}</span></div>` : ''}
                </div>
                <div id="portfolio-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    ${userVideos.map(video => `
                        <div class="bg-[#2a2e33] rounded-lg cursor-pointer group overflow-hidden" data-page="cinema" data-video-id="${video.id}">
                            <div class="relative">
                                <img src="${video.thumbnail}" class="w-full rounded-t-md mb-3 group-hover:scale-105 transition-transform duration-300">
                                <div class="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">${video.status}</div>
                            </div>
                            <div class="p-3">
                                <h3 class="font-semibold text-white">${video.title}</h3>
                                <p class="text-sm text-gray-400">${video.description}</p>
                                <p class="text-xs text-gray-500 mt-2">${video.date}</p>
                            </div>
                        </div>`).join('')}
                </div>
            </div>
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-[#2a2e33] p-6 rounded-lg text-center">
                    <img src="${user.avatar}" class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-600">
                    <h3 class="text-xl font-bold text-white">${user.name} <span class="text-base font-normal text-gray-400">lvl ${user.level}</span></h3>
                    <p class="text-sm text-gray-400 mt-2">${user.bio || ''}</p>
                    <div class="mt-4 flex justify-center space-x-2">${socialButtons}</div>
                </div>
                 <div class="bg-[#2a2e33] p-4 rounded-lg space-y-1" id="folder-nav">
                    ${['all', 'personal', 'collabs', 'ideas', 'remaster'].map(cat => `
                        <div class="flex items-center space-x-3 p-2 rounded-md ${category === cat ? 'bg-blue-500/20' : ''} hover:bg-gray-700/50 cursor-pointer" data-category="${cat}">
                            <i data-lucide="folder"></i>
                            <span class="capitalize">${cat === 'all' ? 'All Works' : cat}</span>
                        </div>`).join('')}
                </div>
            </div>
        </div>`;
};
