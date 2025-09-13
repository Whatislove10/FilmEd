import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Medal, Star, Video } from "lucide-react";

export default function ProfilePage() {
  const fakeVideos = [
    { id: 1, url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4", votes: 12 },
    { id: 2, url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4", votes: 30 },
  ];

  const badges = [
    { icon: <Medal className="h-4 w-4 mr-2" />, text: "Challenge Winner" },
    { icon: <Star className="h-4 w-4 mr-2" />, text: "7-Day Streak" },
    { icon: <Video className="h-4 w-4 mr-2" />, text: "First Submission" },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center space-x-6">
        <Avatar className="h-28 w-28 border-2 border-primary">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold">TestUser</h1>
          <p className="text-muted-foreground text-lg">Challenge enthusiast & content creator.</p>
        </div>
      </div>
      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Your journey so far.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Challenge Wins</span><span className="font-bold text-primary">1</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Active Streak</span><span className="font-bold text-primary">7 days</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Submissions</span><span className="font-bold text-primary">{fakeVideos.length}</span></div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 transition-all duration-300 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Your collected achievements.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-sm transition-transform hover:scale-110 cursor-pointer">
                {badge.icon}
                {badge.text}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Submissions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fakeVideos.map((v) => (
            <Card key={v.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
              <CardContent className="p-0">
                <video src={v.url} controls width="100%" className="aspect-video" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}