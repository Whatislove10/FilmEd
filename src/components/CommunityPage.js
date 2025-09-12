// src/components/CommunityPage.js
import { db } from '../data.js';

export const CommunityPage = () => {
    const renderMatch = (match, size = 'md') => {
        const sizes = {
            sm: {img: '120x67', text: 'xs'},
            md: {img: '160x90', text: 'sm'},
        };
        return match.map(p => {
            const video = db.videos.find(v => v.id === p.videoId);
            const user = db.users[p.userId];
            return `<div class="text-center cursor-pointer group" data-page="collection" data-user-id="${p.userId}">
                        <img src="${video.thumbnail.replace('400/225', sizes[size].img)}" class="rounded mb-1 mx-auto border-2 border-transparent group-hover:border-blue-500 transition-all">
                        <span class="text-${sizes[size].text} font-semibold">${user.name}</span>
                    </div>`}).join(`<span class="text-gray-500 font-bold text-xl p-2">VS</span>`);
    };
    
    return `
        <div class="bg-[#2a2e33] p-6 rounded-lg">
            <h2 class="text-3xl font-bold text-white mb-8 text-center tracking-wider">Tournament Bracket</h2>
            <div class="flex justify-between items-stretch text-center">
                <!-- QUALIFIERS -->
                <div class="w-1/3 space-y-8 flex flex-col justify-around">
                     <h3 class="font-bold text-purple-400 tracking-wider">QUALIFIERS</h3>
                     ${db.tournament.qualifiers.map(match => `<div class="flex justify-center items-center">${renderMatch(match, 'sm')}</div>`).join('')}
                </div>
                <!-- SEMI-FINALS -->
                <div class="w-1/3 flex flex-col justify-around items-center space-y-16">
                     <h3 class="font-bold text-green-400 tracking-wider">SEMI-FINALS</h3>
                      ${db.tournament.semi_finals.map(match => `<div class="flex justify-center items-center">${renderMatch(match, 'sm')}</div>`).join('')}
                </div>
                <!-- FINALS -->
                <div class="w-1/3 flex flex-col justify-center items-center space-y-4">
                    <h3 class="font-bold text-blue-400 tracking-wider">GRAND FINALE</h3>
                    <p class="text-xs text-gray-400">TOMORROW 20:00</p>
                    <div class="flex justify-center items-center">${renderMatch(db.tournament.final, 'md')}</div>
                </div>
            </div>
        </div>`;
};
