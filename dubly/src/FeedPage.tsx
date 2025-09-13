import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";

export default function FeedPage() {
  const feedVideos = [
    { id: 1, user: "VideoMaster", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4", likes: 128, comments: 12 },
    { id: 2, user: "Cinephile_Cut", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4", likes: 256, comments: 23 },
    { id: 3, user: "PixelPerfect", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4", likes: 512, comments: 45 },
    { id: 4, user: "ShakyCam", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4", likes: 64, comments: 5 },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Community Feed</h1>
        <p className="text-muted-foreground mt-2 text-lg">A random selection of videos from our talented users.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {feedVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
            <CardContent className="p-0">
               <video src={video.url} controls width="100%" className="aspect-video" />
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://i.pravatar.cc/40?u=${video.user}`} />
                        <AvatarFallback>{video.user.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm">{video.user}</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {video.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {video.comments}</span>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}