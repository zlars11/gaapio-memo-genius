
import { useEffect, useState } from 'react';

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
  category?: string; // ✅ this fixes the TS error
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Example: Replace with your real fetch logic
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data: BlogPost[]) => {
        setPosts(data);
      });
  }, []);

  return (
    <div className="blog-page">
      {posts.map((post) => (
        <div key={post.id} className="blog-post">
          <h2>{post.title}</h2>
          {post.category && <span className="category">{post.category}</span>}
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default Blog;
