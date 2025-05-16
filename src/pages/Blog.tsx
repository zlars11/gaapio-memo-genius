
import { useEffect, useState } from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Separator } from "@/components/ui/separator";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  publish_date: string;
  updated_at: string;
  author: string;
  status: string;
  category?: string;
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Example fetch - in production, this would hit a real API endpoint
    setIsLoading(true);
    
    // Simulate API fetch with some sample data
    setTimeout(() => {
      const samplePosts: BlogPost[] = [
        {
          id: "1",
          title: "5 Common ASC 606 Revenue Recognition Pitfalls",
          slug: "5-common-asc-606-pitfalls",
          excerpt: "Learn about the most common mistakes companies make when implementing ASC 606 and how to avoid them.",
          content: "Full article content goes here...",
          thumbnail_url: "/lovable-uploads/49bf8f26-e72a-4813-ae6e-65275eca9e0b.png",
          publish_date: "2025-04-15",
          updated_at: "2025-04-15",
          author: "Sarah Johnson, CPA",
          status: "published",
          category: "Revenue Recognition"
        },
        {
          id: "2",
          title: "Using AI to Streamline Month-End Close",
          slug: "ai-streamline-month-end-close",
          excerpt: "Discover how artificial intelligence is transforming the month-end close process for accounting teams.",
          content: "Full article content goes here...",
          thumbnail_url: "/lovable-uploads/0ca75d1e-cef9-48b9-b1fa-91dca93bbddc.png",
          publish_date: "2025-04-01",
          updated_at: "2025-04-01",
          author: "Michael Chen, CPA",
          status: "published",
          category: "Accounting Tech"
        },
        {
          id: "3",
          title: "The Future of Lease Accounting",
          slug: "future-of-lease-accounting",
          excerpt: "An in-depth analysis of upcoming changes to lease accounting standards and how to prepare.",
          content: "Full article content goes here...",
          thumbnail_url: "/lovable-uploads/e13abd02-7766-469a-af2d-18a152812501.png",
          publish_date: "2025-03-20",
          updated_at: "2025-03-20",
          author: "Emily Roberts, CPA",
          status: "published",
          category: "Lease Accounting"
        }
      ];
      
      setPosts(samplePosts);
      setIsLoading(false);
    }, 500);
    
    // In a real app with Supabase, you would use:
    // const fetchPosts = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('blog_posts')
    //       .select('*')
    //       .eq('status', 'published')
    //       .order('publish_date', { ascending: false });
    //
    //     if (error) throw error;
    //     setPosts(data || []);
    //   } catch (error) {
    //     console.error('Error fetching blog posts:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchPosts();
  }, []);

  // Adapt our blog post data to match the BlogPostCard component props
  const adaptedPosts = posts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    date: new Date(post.publish_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    author: post.author,
    imageUrl: post.thumbnail_url,
    category: post.category,
    slug: post.slug
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Accounting Resources & Insights</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert articles, guidance, and updates on technical accounting topics
            </p>
          </div>
          
          <Separator className="mb-12" />
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className="h-[400px] rounded-lg bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adaptedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
