
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define the blog post type with category
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publish_date: string;
  updated_at: string;
  status: string;
  thumbnail_url: string;
  category?: string; // Added optional category field
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const blogCardsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = blogCardsRef.current?.querySelectorAll(".blog-card-item");
    cards?.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      cards?.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, [posts]);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("publish_date", { ascending: false });
      
      if (error) throw error;
      
      // Cast data to BlogPost[] type and ensure each post has a category
      const typedPosts = (data || []).map(post => ({
        ...post,
        category: post.category || "General" // Ensure category exists, defaulting to "General"
      })) as BlogPost[];
      
      setPosts(typedPosts);

      // Extract unique categories from posts
      const uniqueCategories = Array.from(
        new Set(typedPosts.map(post => post.category || "General"))
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  // Placeholder loading skeleton
  const BlogCardSkeleton = () => (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Skip to content link for keyboard users */}
      <a href="#blog-content" className="skip-to-content">
        Skip to content
      </a>
      
      <main className="flex-1 pt-28" id="blog-content">
        <section className="py-12 md:py-16 lg:py-24" aria-labelledby="blog-heading">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
              <h1 id="blog-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Insights from the Gaapio Team</h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Expert perspectives on technical accounting, compliance, and technology.
              </p>
            </div>

            {categories.length > 0 && (
              <div className="max-w-xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-2 p-2">
                  <Label htmlFor="category-filter" className="text-sm font-medium whitespace-nowrap">
                    Filter by Topic:
                  </Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger id="category-filter" className="w-[200px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCategory !== "all" && (
                    <Badge variant="outline" className="ml-2">
                      Showing: {selectedCategory}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div 
              ref={blogCardsRef}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" 
              role="list" 
              aria-label="Blog posts"
            >
              {isLoading ? (
                // Display skeleton loaders while loading
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="blog-card-item">
                    <BlogCardSkeleton />
                  </div>
                ))
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <div 
                    key={post.id} 
                    role="listitem" 
                    className="blog-card-item opacity-0 transform translate-y-4 transition-all duration-500"
                  >
                    <BlogPostCard 
                      post={{
                        id: post.id,
                        title: post.title,
                        excerpt: post.excerpt || "Read more about this topic...",
                        date: new Date(post.publish_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }),
                        author: post.author || "Gaapio Team",
                        imageUrl: post.thumbnail_url || "/lovable-uploads/01273276-ea88-43e0-9d91-0cb238f997be.png",
                        category: post.category || "General",
                        slug: post.slug
                      }} 
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    {selectedCategory !== "all" 
                      ? `No posts found in the "${selectedCategory}" category.` 
                      : "No blog posts found."}
                  </p>
                </div>
              )}
            </div>

            {filteredPosts.length > 0 && (
              <div className="text-center mt-12 md:mt-16 animate-fade-in">
                <p className="text-muted-foreground text-sm px-4 max-w-2xl mx-auto">
                  Stay tuned for more insights and articles from our team of accounting professionals.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
