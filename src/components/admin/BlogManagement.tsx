
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, RefreshCw, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { BlogPostForm } from "./BlogPostForm";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function BlogManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(true);
  const { toast } = useToast();

  // Fetch blog posts on component mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("publish_date", { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
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

  const handleCreatePost = () => {
    setSelectedPost(null);
    setIsCreateMode(true);
    setIsFormOpen(true);
  };

  const handleEditPost = (post: any) => {
    setSelectedPost(post);
    setIsCreateMode(false);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = (post: any) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", selectedPost.id);
      
      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handleSavePost = async (postData: any) => {
    try {
      let result;
      
      if (isCreateMode) {
        // Create new post
        const { data, error } = await supabase
          .from("blog_posts")
          .insert([postData])
          .select();
        
        if (error) throw error;
        result = data?.[0];
        
        // Add the new post to the list
        setPosts([result, ...posts]);
      } else {
        // Update existing post
        const { data, error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", selectedPost?.id)
          .select();
        
        if (error) throw error;
        result = data?.[0];
        
        // Update the post in the list
        setPosts(posts.map(post => 
          post.id === selectedPost?.id ? result : post
        ));
      }
      
      setIsFormOpen(false);
      
      toast({
        title: "Success",
        description: `Blog post ${isCreateMode ? "created" : "updated"} successfully`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving blog post:", error);
      return Promise.reject(error);
    }
  };

  const handleViewPost = (slug: string) => {
    window.open(`/blog/${slug}`, "_blank");
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl">Blog Posts</CardTitle>
        <Button onClick={handleCreatePost}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full py-12 flex flex-col items-center justify-center text-muted-foreground">
            <RefreshCw className="h-8 w-8 animate-spin mb-2" />
            <p>Loading blog posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="w-full py-12 flex flex-col items-center justify-center text-muted-foreground">
            <p className="mb-4">No blog posts found</p>
            <Button onClick={handleCreatePost} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Post
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {post.thumbnail_url && (
                          <img 
                            src={post.thumbnail_url} 
                            alt={post.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium truncate max-w-xs">{post.title}</div>
                          <div className="text-xs text-muted-foreground">
                            /blog/{post.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.status === "published" ? (
                        <Badge variant="default" className="bg-green-600">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-sm">
                          {format(parseISO(post.publish_date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{post.category || "General"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewPost(post.slug)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleConfirmDelete(post)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <ScrollArea className="max-h-[calc(90vh-100px)]">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">
                {isCreateMode ? "Create New Blog Post" : "Edit Blog Post"}
              </h2>
              <Separator className="my-4" />
              <BlogPostForm
                post={selectedPost}
                onSave={handleSavePost}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the blog post 
              <span className="font-medium"> "{selectedPost?.title}"</span>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
