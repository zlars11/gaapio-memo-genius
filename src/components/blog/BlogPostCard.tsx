
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>
        <h3 className="text-xl font-bold leading-tight hover:text-primary transition-colors">
          <a href="#">{post.title}</a>
        </h3>
      </CardHeader>
      <CardContent className="py-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <span className="text-xs text-muted-foreground">By {post.author}</span>
        <a 
          href="#" 
          className="text-sm font-medium text-primary hover:underline"
        >
          Read More
        </a>
      </CardFooter>
    </Card>
  );
}
