
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Helmet } from "react-helmet";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (error) throw error;

        if (data) {
          setPost(data);
        } else {
          setError("Blog post not found");
          navigate("/blog", { replace: true });
        }
      } catch (err: any) {
        console.error("Error fetching blog post:", err);
        setError(err.message || "Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pt-28 pb-16">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <Skeleton className="h-12 w-4/5 mb-4" />
            <Skeleton className="h-6 w-3/5 mb-8" />
            <Skeleton className="h-80 w-full mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-3/5" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    navigate("/blog", { replace: true });
    return null;
  }

  const publishDate = parseISO(post.publish_date);
  const formattedDate = new Date(post.publish_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeAgo = formatDistanceToNow(publishDate, { addSuffix: true });

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>{post.meta_title || post.title} - Gaapio</title>
        <meta name="description" content={post.meta_description || post.excerpt || `Read about ${post.title}`} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || `Read about ${post.title}`} />
        {post.thumbnail_url && <meta property="og:image" content={post.thumbnail_url} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://gaapio.com/blog/${post.slug}`} />
      </Helmet>

      <Header />
      
      <main className="flex-1 pt-28 pb-16">
        <article className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-4 -ml-2 text-muted-foreground"
                onClick={() => navigate("/blog")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Blog
              </Button>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span title={timeAgo}>{formattedDate}</span>
                </div>
                {post.author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                )}
                {post.category && (
                  <Badge variant="outline">{post.category}</Badge>
                )}
              </div>
              
              {post.thumbnail_url && (
                <div className="mt-6 mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={post.thumbnail_url} 
                    alt={post.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
            
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
