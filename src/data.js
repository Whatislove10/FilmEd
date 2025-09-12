// src/data.js

// --- ENHANCED DATABASE SIMULATION ---
export const db = {
    users: {
        1: { id: 1, name: "TEMIK_TITAN228", level: 25, avatar: "https://i.pravatar.cc/150?u=1", portfolioTitle: "My Portfolio", bio: "Just a guy who loves to code and create." },
        2: { id: 2, name: "Serjoga", level: 5, avatar: "https://i.pravatar.cc/150?u=2", bio: "2 year at BFM (Audiovisual Media)", social: { youtube: "#" } },
        3: { id: 3, name: "Samuel Tarantino", level: 41, avatar: "https://i.pravatar.cc/150?u=3", bio: '"Making movies is life, making movies is love ..."', portfolioTitle: "Sam Tarantino's Portfolio", views: 5746, plays: 5521746, social: { youtube: "#", wiki: "#", help: "#" } },
        4: { id: 4, name: "Maximka_Pupok", level: 18, avatar: "https://i.pravatar.cc/150?u=4", bio: "Aspiring director." },
        5: { id: 5, name: "Anna_Art", level: 33, avatar: "https://i.pravatar.cc/150?u=5", bio: "Visual effects specialist." }
    },
    videos: [
        { id: 101, userId: 3, title: `Jack and Rose "I'm Flying"`, description: "If it was in Eastern Europe", movie: "Titanic", year: 1997, thumbnail: "https://picsum.photos/seed/titanic/400/225", tags: ["remaster", "drama"], rating: 3, status: "GRAND FINALE", date: "22/06/2025", category: "remaster" },
        { id: 102, userId: 3, title: `"Don Vito" from Godfather 1`, description: "Cyberpunk Edition", movie: "Godfather 1", year: 1972, thumbnail: "https://picsum.photos/seed/godfather/400/225", tags: ["cyberpunk", "sci-fi"], status: "SEMI-FINALS", date: "21/05/2025", category: "personal" },
        { id: 103, userId: 3, title: `"Gollum isn't lying" from LOTR`, description: "1984 style dystopia", movie: "Lord of the Rings", year: 2002, thumbnail: "https://picsum.photos/seed/lotr/400/225", tags: ["dystopia", "fantasy"], status: "Pre-qualifier", date: "11/07/2025", category: "collabs" },
        { id: 104, userId: 3, title: `"My money" from Scarface`, description: "Silent-Noir Genre", movie: "Scarface", year: 1983, thumbnail: "https://picsum.photos/seed/scarface/400/225", tags: ["noir", "crime"], status: "AWAITING", date: "10/09/2025", category: "ideas" },
        { id: 105, userId: 1, title: `My First Masterpiece`, description: "A short film about coding", movie: "Life", year: 2024, thumbnail: "https://picsum.photos/seed/coding/400/225", tags: ["short", "tech"], status: "Published", date: "01/01/2025", category: "personal" },
        { id: 106, userId: 2, title: `Forest Gump's Run`, description: "A modern take", movie: "Forest Gump", year: 1994, thumbnail: "https://picsum.photos/seed/forest/400/225", tags: ["remake", "run"], status: "Qualifier", date: "15/04/2025", category: "personal" },
        { id: 107, userId: 4, title: `Space Odyssey`, description: "A zero-gravity ballet", movie: "2001: A Space Odyssey", year: 1968, thumbnail: "https://picsum.photos/seed/space/400/225", tags: ["space", "sci-fi"], status: "Qualifier", date: "18/04/2025", category: "personal" },
        { id: 108, userId: 5, title: `Matrix Lobby Scene`, description: "VFX breakdown", movie: "The Matrix", year: 1999, thumbnail: "https://picsum.photos/seed/matrix/400/225", tags: ["vfx", "action"], status: "Pre-qualifier", date: "01/03/2025", category: "collabs" },
    ],
    tournament: {
        final: [{ userId: 2, videoId: 106 }, { userId: 4, videoId: 107 }],
        semi_finals: [
            [{ userId: 2, videoId: 106 }, { userId: 1, videoId: 105 }],
            [{ userId: 4, videoId: 107 }, { userId: 3, videoId: 102 }]
        ],
        qualifiers: [
            [{ userId: 1, videoId: 105 }, { userId: 5, videoId: 108 }],
            [{ userId: 2, videoId: 106 }, { userId: 3, videoId: 103 }],
            [{ userId: 4, videoId: 107 }, { userId: 3, videoId: 104 }]
        ]
    }
};

export const currentUserId = 1;
