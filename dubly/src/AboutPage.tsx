import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clapperboard, Lightbulb, Users, Video } from "lucide-react";
import { Link } from "react-router-dom";

// A reusable component for feature cards
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
    <CardHeader className="items-center">
      <div className="bg-primary/20 p-4 rounded-full mb-4">{icon}</div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function AboutPage() {
  return (
    <div className="space-y-20 fade-in">
      {/* --- Hero Section --- */}
      <section className="text-center py-16">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">What is Filmit?</h1>
        <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
          Filmit is more than just a platform; it's a creative playground for aspiring filmmakers and video enthusiasts. It's a space to challenge yourself, learn new skills, and share your passion with a vibrant community.
        </p>
      </section>

      <Separator />

      {/* --- "How It Works" Section --- */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-10">A Cycle of Creativity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Clapperboard className="h-8 w-8 text-primary" />}
            title="Weekly Challenges"
            description="Receive a new, exciting prompt every week to ignite your creativity. From recreating iconic scenes to exploring new themes."
          />
          <FeatureCard
            icon={<Video className="h-8 w-8 text-primary" />}
            title="Create & Share"
            description="Shoot and edit your masterpiece. Upload your submission to the platform and share your unique vision with the world."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-primary" />}
            title="Vote & Get Recognized"
            description="Watch submissions from fellow creators, cast your vote for the best video, and receive valuable community feedback on your work."
          />
        </div>
      </section>
      
      {/* --- Mission Section --- */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="mt-4 text-muted-foreground text-lg">
                We believe that everyone has a story to tell. Our mission is to provide the tools, inspiration, and community support to help you tell yours. Whether you're a beginner with a smartphone or a seasoned pro, Filmit is your stage.
            </p>
        </div>
        <div className="flex justify-center">
            <Lightbulb className="w-32 h-32 text-primary/30" strokeWidth={1.5} />
        </div>
      </section>

      <Separator />

      {/* --- Call to Action Section --- */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold">Ready to Create?</h2>
        <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
          Your next masterpiece is just a challenge away. Join the community and start your filmmaking journey today.
        </p>
        <Button asChild size="lg" className="mt-8 transition-transform hover:scale-105">
          <Link to="/challenges">View Current Challenges</Link>
        </Button>
      </section>
    </div>
  );
}