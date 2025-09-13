import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Film } from "lucide-react";

export default function LearnPage() {
  const articles = [
    { title: "Shooting Video with Your Phone", content: "Detailed guide on how to get the best quality from your smartphone camera." },
    { title: "The Basics of Video Editing", content: "Learn about cuts, transitions, and color grading to make your videos pop." },
    { title: "Lighting and Sound for Home Setups", content: "Essential tips for improving your production value without breaking the bank." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Learning Center</h1>
        <p className="text-muted-foreground">Your hub for tutorials and articles to improve your skills.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            <span>Featured Video Tutorial</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video overflow-hidden rounded-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            <span>Helpful Articles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {articles.map((article, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{article.title}</AccordionTrigger>
                <AccordionContent>{article.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}