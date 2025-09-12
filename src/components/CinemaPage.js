// src/components/CinemaPage.js
import { db } from '../data.js';

export const CinemaPage = (videoId = 101) => {
    const video = db.videos.find(v => v.id === videoId);
    const author = db.users[video.userId];
    const otherVideos = db.videos.filter(v => v.id !== videoId);

    return `
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div class="xl:col-span-2 bg-[#2a2e33] p-4 sm:p-6 rounded-lg shadow-lg">
                <div class="relative bg-black aspect-video flex items-center justify-center rounded-md overflow-hidden">
                    <img src="${video.thumbnail.replace('/400/225', '/1280/720')}" alt="Video thumbnail" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <button class="w-20 h-20 text-white/70 hover:text-white transition-all transform hover:scale-110 duration-300">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="relative w-full h-1.5 bg-gray-600/50 rounded-full mt-4 cursor-pointer">
                    <div class="absolute h-full bg-blue-500 rounded-full w-1/3"></div>
                    <div class="absolute h-4 w-4 bg-white rounded-full -top-1.5 transform -translate-x-1/2 cursor-pointer" style="left: 33.33%;"></div>
                </div>
                <div class="relative mt-4">
                    <div class="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                        ${otherVideos.map(v => `
                            <div class="relative flex-shrink-0 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" data-page="cinema" data-video-id="${v.id}">
                                <img src="${v.thumbnail.replace('/400/225','/160/90')}" alt="${v.title}" class="w-40 h-auto rounded">
                            </div>`).join('')}
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-gray-700/50 pt-6">
                    <div>
                        <div class="flex items-center space-x-3">
                            <img src="${author.avatar}" alt="${author.name}" class="w-10 h-10 rounded-full">
                            <div>
                                <p class="font-semibold text-white cursor-pointer hover:underline" data-page="collection" data-user-id="${author.id}">Submitted by ${author.name} <span class="text-gray-400">(lvl ${author.level})</span></p>
                                <p class="text-sm text-gray-400">${author.bio || ''}</p>
                            </div>
                        </div>
                        <div class="mt-4">
                            <p class="text-sm text-gray-400 mb-2">tags:</p>
                            <div class="flex flex-wrap gap-2">${video.tags.map(tag => `<span class="bg-gray-700/60 text-xs font-medium px-2.5 py-1 rounded-full">${tag}</span>`).join('')}</div>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <p><span class="font-semibold text-white">Your rating: ${video.rating} place</span></p>
                        <p class="text-sm">${video.description}</p>
                    </div>
                </div>
            </div>
            <div class="bg-[#2a2e33] p-4 sm:p-6 rounded-lg shadow-lg self-start">
                 <div class="flex space-x-4 cursor-pointer" data-page="cinema" data-video-id="${otherVideos[0].id}">
                    <img src="${otherVideos[0].thumbnail.replace('/400/225', '/150/100')}" alt="Next video" class="w-32 lg:w-40 rounded-md">
                    <div class="flex-grow">
                        <h3 class="font-bold text-white">${otherVideos[0].title}</h3>
                        <p class="text-sm text-gray-400 mt-1">${otherVideos[0].movie} ${otherVideos[0].year}</p>
                    </div>
                </div>
                <div class="mt-6 flex space-x-2">
                    <button class="bg-gray-700/60 hover:bg-gray-700 w-full text-sm font-semibold py-2 px-4 rounded-md transition-colors">IMDB</button>
                    <button class="bg-gray-700/60 hover:bg-gray-700 w-full text-sm font-semibold py-2 px-4 rounded-md transition-colors">WIKI</button>
                </div>
            </div>
        </div>`;
};
