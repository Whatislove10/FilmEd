import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clapperboard, Medal, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Компонент для "фич" сайта
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="bg-white/10 backdrop-blur-sm border-primary/20 text-center transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
    <CardHeader className="items-center">
      <div className="bg-primary/20 p-4 rounded-full mb-4">{icon}</div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
);

export default function HomePage() {
  return (
    <div className="w-full">
      {/* --- Hero Section --- */}
      <section className="h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Видео-фон (симуляция) */}
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-[-1] opacity-30" style={{ backgroundImage: "url('https://images.pexels.com/photos/7993425/pexels-photo-7993425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 fade-in animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Unleash Your Inner Filmmaker
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-8 fade-in" style={{ animationDelay: '0.4s' }}>
          Join a community of creators. Participate in weekly challenges, hone your skills, and get your work recognized.
        </p>
        <div className="fade-in" style={{ animationDelay: '0.6s' }}>
          <Button asChild size="lg" className="transition-transform hover:scale-105">
            <Link to="/challenges">Start Your First Challenge</Link>
          </Button>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clapperboard className="h-8 w-8 text-primary" />}
              title="Accept a Challenge"
              description="Every week, a new theme is announced. Recreate a famous scene or create your own short film based on the prompt."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Get Community Feedback"
              description="Submit your video and let the community vote. Get valuable feedback and see what others have created."
            />
            <FeatureCard
              icon={<Medal className="h-8 w-8 text-primary" />}
              title="Win and Get Recognized"
              description="The top-voted video wins the weekly challenge. Earn badges, build your profile, and make a name for yourself."
            />
          </div>
        </div>
      </section>
    </div>
  );
}