
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { memo } from "react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
  category: string;
}

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard = memo(function BlogPostCard({ post }: BlogPostCardProps) {
  const postSlug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl hover:shadow-lg transition-all duration-300 border border-border/50">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={post.imageUrl}
          alt={`Featured image for article: ${post.title}`}
          className="h-full w-full object-cover transition-transform hover:scale-105 duration-300 filter grayscale"
          loading="lazy"
          decoding="async"
          width={400}
          height={225}
        />
      </div>
      <CardHeader className="pb-0 space-y-2">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
          <span className="text-xs font-medium px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold leading-tight hover:text-primary transition-colors">
          <Link to={`/blog/${postSlug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm">
            {post.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent className="py-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <span className="text-xs text-muted-foreground">By {post.author}</span>
        <Button 
          size="sm" 
          variant="default"
          asChild
          className="rounded-full"
        >
          <Link 
            to={`/blog/${postSlug}`}
            aria-label={`Read more about ${post.title}`}
          >
            Read More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
});
