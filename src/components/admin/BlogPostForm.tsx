
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageWysiwygEditor } from "./PageWysiwygEditor";
import { PageSeoForm } from "./PageSeoForm";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";
import { generateSeoMetadata } from "@/utils/seoUtils";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Image, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogImageUploader } from "./BlogImageUploader";
import { cn } from "@/lib/utils";

interface BlogPostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    category: string;
    publish_date: string;
    status: "draft" | "published";
    thumbnail_url?: string;
    meta_title?: string;
    meta_description?: string;
    featured: boolean;
  };
  onSave: (post: any) => Promise<void>;
  onCancel: () => void;
}

export function BlogPostForm({ post, onSave, onCancel }: BlogPostFormProps) {
  const [activeTab, setActiveTab] = useState<string>("content");
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState<"wysiwyg" | "html">("wysiwyg");
  const [date, setDate] = useState<Date>(post?.publish_date ? parseISO(post.publish_date) : new Date());
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "<p>Start writing your post content here...</p>",
    excerpt: post?.excerpt || "",
    author: post?.author || "",
    category: post?.category || "General",
    status: post?.status || "draft",
    thumbnail_url: post?.thumbnail_url || "",
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
    featured: post?.featured || false,
  });
  
  const [titleError, setTitleError] = useState("");
  const [slugError, setSlugError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(post?.thumbnail_url || null);
  
  // Generate slug from title
  useEffect(() => {
    if (!post && formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, post]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user types
    if (field === "title") setTitleError("");
    if (field === "slug") setSlugError("");
  };

  const generateSeoData = () => {
    const seoData = generateSeoMetadata(formData.title, `/blog/${formData.slug}`, formData.content);
    
    setFormData(prev => ({
      ...prev,
      meta_title: seoData.title,
      meta_description: seoData.description
    }));
    
    toast({
      title: "SEO Data Generated",
      description: "Title and description have been auto-populated",
    });
  };

  const validateForm = (): boolean => {
    let valid = true;
    
    if (!formData.title.trim()) {
      setTitleError("Title is required");
      valid = false;
    }
    
    if (!formData.slug.trim()) {
      setSlugError("Slug is required");
      valid = false;
    }
    
    return valid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setActiveTab("content");
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const postData = {
        ...formData,
        publish_date: date.toISOString(),
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt,
        updated_at: new Date().toISOString(),
      };
      
      await onSave(postData);
      
      toast({
        title: "Success",
        description: `Post ${post ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Error",
        description: `Failed to ${post ? "update" : "create"} post`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "General", 
    "Technical Accounting", 
    "ASC 606", 
    "ASC 842", 
    "Accounting Standards",
    "Best Practices",
    "Technology",
    "AI & Automation",
    "Compliance",
    "Industry News"
  ];

  const handleImageSelected = (url: string) => {
    setSelectedImage(url);
    setFormData(prev => ({ ...prev, thumbnail_url: url }));
  };

  const toggleEditMode = () => {
    setEditMode(prev => prev === "wysiwyg" ? "html" : "wysiwyg");
  };

  return (
    <form ref={formRef} onSubmit={handleSave} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Post Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter post title"
                className={titleError ? "border-destructive" : ""}
              />
              {titleError && <p className="text-destructive text-sm">{titleError}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-base font-medium">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="post-url-slug"
                className={slugError ? "border-destructive" : ""}
              />
              {slugError && <p className="text-destructive text-sm">{slugError}</p>}
              <p className="text-xs text-muted-foreground">
                The URL path will be: /blog/{formData.slug || "post-slug"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-base font-medium">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              placeholder="Brief summary of your post"
              className="resize-none h-20"
            />
            <p className="text-xs text-muted-foreground">
              A short summary displayed in blog listings
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-base font-medium">Content</Label>
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={toggleEditMode}
              >
                {editMode === "wysiwyg" ? "Edit HTML" : "Visual Editor"}
              </Button>
            </div>
            
            <ScrollArea className="border h-[400px] rounded-md">
              {editMode === "wysiwyg" ? (
                <PageWysiwygEditor 
                  content={formData.content}
                  onChange={(content) => handleInputChange("content", content)}
                />
              ) : (
                <Textarea
                  className="min-h-[400px] font-mono border-0 resize-none"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                />
              )}
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Featured Image</Label>
            <BlogImageUploader 
              currentImage={selectedImage} 
              onImageSelected={handleImageSelected}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="seo" className="space-y-4">
          <div className="flex justify-end mb-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateSeoData}
              className="flex items-center"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Auto-Generate SEO
            </Button>
          </div>
          <PageSeoForm 
            metaTitle={formData.meta_title || formData.title}
            metaDescription={formData.meta_description || formData.excerpt}
            canonicalUrl={`/blog/${formData.slug}`}
            onChange={(field, value) => {
              const mappedField = field === "metaTitle" ? "meta_title" : 
                field === "metaDescription" ? "meta_description" : field;
              handleInputChange(mappedField, value);
            }}
          />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="author" className="text-base font-medium">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Post author"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Publication Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label className="text-base font-medium">Status</Label>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="status" className="cursor-pointer">
                    {formData.status === "published" ? (
                      <Badge className="bg-green-600">Published</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.status === "published" 
                      ? "Post is publicly visible" 
                      : "Post is only visible to admins"}
                  </p>
                </div>
                <Switch
                  id="status"
                  checked={formData.status === "published"}
                  onCheckedChange={(checked) => 
                    handleInputChange("status", checked ? "published" : "draft")
                  }
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-3">
            <div className="flex-1 space-y-0.5">
              <Label htmlFor="featured" className="cursor-pointer">Featured Post</Label>
              <p className="text-sm text-muted-foreground">
                Display this post in featured sections of the website
              </p>
            </div>
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange("featured", checked)}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
