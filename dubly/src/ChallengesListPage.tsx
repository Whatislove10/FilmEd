import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Video } from 'lucide-react';

// Типы, которые мы вынесли из App.tsx
interface Challenge {
  id: string;
  title: string;
  description: string;
  originalVideoUrl?: string;
  status: "upcoming" | "active" | "ended";
  winner?: string;
  participants?: number;
  daysLeft?: number;
  image: string; // Добавили поле для изображения
}

// Рандомные изображения для челленджей
const challengeImages = [
    "https://images.pexels.com/photos/274996/pexels-photo-274996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7234283/pexels-photo-7234283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

export default function ChallengesListPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    useEffect(() => {
        const fetchChallenges = async () => {
            const snapshot = await getDocs(collection(db, "challenges"));
            const arr: Challenge[] = [];
            let imageIndex = 0;
            snapshot.forEach((doc) => {
                arr.push({ 
                    ...(doc.data() as Omit<Challenge, 'id' | 'image'>), 
                    id: doc.id,
                    image: challengeImages[imageIndex % challengeImages.length] // Циклически присваиваем картинки
                });
                imageIndex++;
            });
            setChallenges(arr);
        };
        fetchChallenges();
    }, []);

    return (
        <div className="space-y-8 fade-in">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Weekly Challenges</h1>
                <p className="text-muted-foreground mt-2 text-lg">A new theme every week. A new chance to shine.</p>
            </div>

            {challenges.length === 0 ? (
                <p className="text-center text-muted-foreground">Loading challenges...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {challenges.map((c) => (
                        <Card key={c.id} className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                            <div className="relative">
                                <img src={c.image} alt={c.title} className="w-full h-48 object-cover" />
                                <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="absolute top-4 right-4 capitalize">{c.status}</Badge>
                            </div>
                            <CardHeader>
                                <CardTitle>{c.title}</CardTitle>
                                <CardDescription className="line-clamp-3">{c.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {c.participants || 0} Participants</span>
                                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {c.daysLeft || 0} Days Left</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold">PROGRESS</span>
                                    <Progress value={(c.participants || 0) / 10 * 100} className="mt-1 h-2" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link to={`/challenge/${c.id}`}>
                                        <Video className="mr-2 h-4 w-4" /> 
                                        {c.status === 'ended' ? 'View Results' : 'Join Challenge'}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}