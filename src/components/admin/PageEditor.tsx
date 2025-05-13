
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, Eye, RotateCcw, Code, Type } from "lucide-react";

interface PageData {
  title: string;
  path: string;
  description: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

interface PageEditorProps {
  page: {
    title: string;
    path: string;
    description: string;
  };
  onClose: () => void;
}

export function PageEditor({ page, onClose }: PageEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("content");
  const [pageData, setPageData] = useState<PageData>({
    title: page.title,
    path: page.path,
    description: page.description,
    content: "<h1>Sample content</h1><p>This is the content of the page.</p>",
    metaTitle: page.title,
    metaDescription: page.description
  });
  const [originalData, setOriginalData] = useState<PageData | null>(null);
  const { toast } = useToast();

  // Fetch the actual page content when editor opens
  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we'd fetch the actual page content here
        // For now, we'll simulate a delay and use dummy data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const fetchedData = {
          title: page.title,
          path: page.path,
          description: page.description,
          content: `<h1>${page.title}</h1><p>This is the main content for ${page.title}.</p><p>Edit this content to update the page.</p>`,
          metaTitle: page.title,
          metaDescription: page.description
        };
        
        setPageData(fetchedData);
        setOriginalData(fetchedData);
      } catch (error) {
        console.error("Error fetching page data:", error);
        toast({
          title: "Error",
          description: "Failed to load page content",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPageData();
  }, [page, toast]);

  const handleInputChange = (field: keyof PageData, value: string) => {
    setPageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save changes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update originalData with current data to reset "hasChanges"
      setOriginalData({...pageData});
      
      toast({
        title: "Success",
        description: "Page updated successfully",
      });
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = () => {
    if (originalData) {
      setPageData({...originalData});
      toast({
        title: "Changes Reverted",
        description: "All changes have been discarded",
      });
    }
  };

  const handlePreview = () => {
    // Open the page in a new tab for preview
    window.open(page.path, "_blank");
  };

  const hasChanges = originalData && (
    pageData.title !== originalData.title ||
    pageData.content !== originalData.content ||
    pageData.metaTitle !== originalData.metaTitle ||
    pageData.metaDescription !== originalData.metaDescription
  );

  if (isLoading && !originalData) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading page content...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border rounded-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Editing: {page.title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Path: {page.path}
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="content" className="flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center">
              <Code className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input 
                id="title"
                value={pageData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Page Title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Page Content</Label>
              <ScrollArea className="h-[400px] border rounded-md p-4">
                <Textarea 
                  id="content"
                  value={pageData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="HTML content"
                  className="min-h-[380px] border-0 resize-none"
                />
              </ScrollArea>
              <p className="text-xs text-muted-foreground">
                Note: Currently supporting HTML editing. WYSIWYG editor coming soon.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input 
                id="metaTitle"
                value={pageData.metaTitle}
                onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                placeholder="Meta Title"
              />
              <p className="text-xs text-muted-foreground">
                Recommended length: 50-60 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea 
                id="metaDescription"
                value={pageData.metaDescription}
                onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                placeholder="Meta Description"
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Recommended length: 150-160 characters
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-muted/50">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRevert}
            disabled={isLoading || !hasChanges}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Revert
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
