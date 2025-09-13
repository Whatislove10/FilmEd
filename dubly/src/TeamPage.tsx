import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Alex from "/src/assets/Alexnew.jpg";
import Artjom from "/src/assets/artjom.jpg";
import Vlad from "/src/assets/vlad.jpg";
import Nikita from "/src/assets/4ortebanij.png";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  fallback: string;
}

const team: TeamMember[] = [
    { name: "Aleksei Kurõljov", role: "Designer, Pitcher", description: "Frontend developer, design enthusiast, and public speaker.", image: Alex, fallback: "AK" },
    { name: "Vladislav Nesterenko", role: "Backend Beast", description: "Backend specialist with a passion for Java and marketing.", image: Vlad, fallback: "VN" },
    { name: "Artjom Kulikovski", role: "Mobile Applications Expert", description: "Frontend developer focused on JavaScript and entrepreneurship.", image: Artjom, fallback: "AK" },
    { name: "Alina", role: "Creative Designer", description: "The creative mind behind our visual identity.", image: "https://via.placeholder.com/150", fallback: "A" },
    { name: "Nikita Strekalov", role: "Cybersecurity Paladin", description: "Backend developer with expertise in Golang and data analysis.", image: Nikita, fallback: "NS" },
];

export default function TeamPage() {
  return (
    <div className="space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Meet Our Team</h1>
        <p className="text-muted-foreground mt-2 text-lg">The minds behind the magic.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {team.map((member) => (
          <Card key={member.name} className="text-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 border-0 group">
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4 border-4 border-transparent group-hover:border-primary transition-all duration-300">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-primary font-medium">{member.role}</p>
              <p className="text-sm text-muted-foreground mt-2">{member.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};