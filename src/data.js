// База данных пока для визуала
export const db = {
    users: {
        1: { id: 1, name: "TEMIK_TITAN228", level: 25, avatar: "https://i.pravatar.cc/150?u=1" },
        2: { id: 2, name: "Serjoga", level: 5, avatar: "https://i.pravatar.cc/150?u=2" },
        3: { id: 3, name: "Samuel Tarantino", level: 41, avatar: "https://i.pravatar.cc/150?u=3" },
        4: { id: 4, name: "Maximka_Pupok", level: 18, avatar: "https://i.pravatar.cc/150?u=4" },
        5: { id: 5, name: "Anna_Art", level: 33, avatar: "https://i.pravatar.cc/150?u=5" }
    },
    videos: [
        { id: 101, userId: 3, title: `Original Video`, description: "This is the original video", thumbnail: "https://picsum.photos/seed/original/400/225" },
        { id: 102, userId: 3, title: `Parody 1`, description: "Our first parody", thumbnail: "https://picsum.photos/seed/p1/400/225" },
        { id: 103, userId: 4, title: `Parody 2`, description: "Our second parody", thumbnail: "https://picsum.photos/seed/p2/400/225" },
        { id: 104, userId: 5, title: `Parody 3`, description: "Our third parody", thumbnail: "https://picsum.photos/seed/p3/400/225" },
        { id: 105, userId: 1, title: `Parody 4`, description: "Our fourth parody", thumbnail: "https://picsum.photos/seed/p4/400/225" },
    ]
};

export const currentUserId = 1;