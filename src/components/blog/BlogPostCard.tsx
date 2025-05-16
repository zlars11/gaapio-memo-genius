
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number | string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
  category?: string; // Made optional to match actual data structure
  slug: string;
}

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="object-cover w-full h-full transition-all hover:scale-105 duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="font-medium">
            {post.category || "General"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-semibold line-clamp-2 mb-2 min-h-[56px]">
          <Link to={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 min-h-[60px]">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex justify-between items-center border-t text-sm text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
          <span>{post.date}</span>
        </div>
        <div className="flex items-center">
          <User className="h-3.5 w-3.5 mr-1 opacity-70" />
          <span>{post.author}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
