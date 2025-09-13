import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Video } from 'lucide-react';
import { cn } from '@/lib/utils'; // <-- 1. Импортируем утилиту cn

// Импорт локальных изображений
import titanicImage from '@/assets/titanic.jpg';
import matrixImage from '@/assets/matrix.jpg';
import scarfaceImage from '@/assets/scarface.jpg';

interface Challenge {
  id: string;
  title: string;
  description: string;
  status: "upcoming" | "active" | "ended";
  participants?: number;
  daysLeft?: number;
  image: string;
}

const challengeImages = [titanicImage, matrixImage, scarfaceImage];

export default function ChallengesListPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [sortedChallenges, setSortedChallenges] = useState<Challenge[]>([]);

    useEffect(() => {
        const fetchChallenges = async () => {
            const snapshot = await getDocs(collection(db, "challenges"));
            const arr: Challenge[] = [];
            let imageIndex = 0;
            snapshot.forEach((doc) => {
                arr.push({ 
                    ...(doc.data() as Omit<Challenge, 'id' | 'image'>), 
                    id: doc.id,
                    image: challengeImages[imageIndex % challengeImages.length] 
                });
                imageIndex++;
            });
            setChallenges(arr);
        };
        fetchChallenges();
    }, []);

    // 2. Сортируем челленджи, чтобы активный всегда был первым
    useEffect(() => {
        const sorted = [...challenges].sort((a, b) => {
            if (a.status === 'active') return -1;
            if (b.status === 'active') return 1;
            return 0;
        });
        setSortedChallenges(sorted);
    }, [challenges]);

    return (
        <div className="space-y-8 fade-in">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Weekly Challenges</h1>
                <p className="text-muted-foreground mt-2 text-md md:text-lg">A new theme every week. A new chance to shine.</p>
            </div>

            {sortedChallenges.length === 0 ? (
                <p className="text-center text-muted-foreground">Loading challenges...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedChallenges.map((c) => (
                        <Card 
                          key={c.id} 
                          // --- 3. ПРИМЕНЯЕМ УСЛОВНЫЕ СТИЛИ ---
                          className={cn(
                            "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
                            c.status === 'active' 
                              ? "border-2 border-primary animate-pulse-glow" // Стили для активного
                              : "hover:scale-105 hover:shadow-2xl hover:shadow-primary/20" // Стили для остальных
                          )}
                        >
                            <div className="relative">
                                <img src={c.image} alt={c.title} className="w-full h-48 object-cover" />
                                <Badge 
                                  variant={c.status === 'active' ? 'default' : 'secondary'} 
                                  // --- 4. ДЕЛАЕМ БЕЙДЖ ЯРЧЕ ---
                                  className={cn(
                                    "absolute top-4 right-4 capitalize",
                                    c.status === 'active' && "text-lg px-4 py-1 bg-red-600 text-white animate-pulse"
                                  )}
                                >
                                  {c.status === 'active' ? 'LIVE' : c.status}
                                </Badge>
                            </div>
                            <CardHeader>
                                <CardTitle>{c.title}</CardTitle>
                                <CardDescription className="line-clamp-3 h-[4.5rem]">{c.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {c.participants || 0} Participants</span>
                                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {c.daysLeft || 0} Days Left</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold">PROGRESS</span>
                                    <Progress value={((c.participants || 0) / 10) * 100} className="mt-1 h-2" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" size={c.status === 'active' ? 'lg' : 'default'}>
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