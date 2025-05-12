
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceExternalCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  delay?: number;
}

export function ResourceExternalCard({ 
  title, 
  description, 
  imageUrl, 
  link,
  delay = 0
}: ResourceExternalCardProps) {
  const animationDelay = delay ? `${delay}ms` : '0ms';
  
  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "animate-on-scroll flex flex-col items-center text-center p-5 rounded-xl border border-border/40",
        "bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300",
        "hover:scale-[1.03] hover:shadow-lg group",
        "dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626]"
      )}
      style={{ animationDelay }}
    >
      <div className="h-16 w-16 mb-4 relative flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={`${title} logo`} 
          className="max-h-full max-w-full object-contain filter dark:brightness-95"
        />
      </div>
      
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      
      <p className="text-sm text-muted-foreground mb-4 dark:text-gray-400">
        {description}
      </p>
      
      <div className="flex items-center mt-auto text-sm font-medium text-primary group-hover:text-blue-600 dark:text-[#339CFF]">
        <span>Visit Resource</span>
        <ExternalLink className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </a>
  );
}
