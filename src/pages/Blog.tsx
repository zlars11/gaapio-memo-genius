
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlogPostCard } from "@/components/blog/BlogPostCard";

const samplePosts = [
  {
    id: 1,
    title: "Why Technical Accounting Memos Matter",
    excerpt: "Discover why thorough documentation is essential for audit readiness and regulatory compliance.",
    date: "April 10, 2025",
    author: "Zack Larsen, CPA",
    imageUrl: "/lovable-uploads/01273276-ea88-43e0-9d91-0cb238f997be.png",
    category: "Best Practices"
  },
  {
    id: 2,
    title: "5 Common ASC 606 Pitfalls",
    excerpt: "Navigate the complexities of revenue recognition and avoid these frequent mistakes in your accounting memos.",
    date: "October 29, 2025",
    author: "Zack Larsen, CPA",
    imageUrl: "/lovable-uploads/76a4d290-2102-4790-88a8-8783b2d8ae44.png",
    category: "Accounting Standards"
  },
  {
    id: 3,
    title: "How AI Is Changing the Accounting Landscape",
    excerpt: "Explore the impact of artificial intelligence on accounting workflows and documentation processes.",
    date: "March 28, 2025",
    author: "Zack Larsen, CPA",
    imageUrl: "/lovable-uploads/0ca75d1e-cef9-48b9-b1fa-91dca93bbddc.png",
    category: "Technology"
  }
];

export default function Blog() {
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

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto" role="list" aria-label="Blog posts">
              {samplePosts.map(post => (
                <div key={post.id} role="listitem">
                  <BlogPostCard post={post} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12 md:mt-16">
              <p className="text-muted-foreground px-4">
                Stay tuned for more insights and articles from our team of accounting professionals.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
