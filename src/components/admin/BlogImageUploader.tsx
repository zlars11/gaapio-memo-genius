
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Image, Upload, X, RefreshCw, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface BlogImageUploaderProps {
  currentImage: string | null;
  onImageSelected: (url: string) => void;
}

export function BlogImageUploader({ currentImage, onImageSelected }: BlogImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      onImageSelected(urlData.publicUrl);

      toast({
        title: "Upload successful",
        description: "Image has been uploaded",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleOpenGallery = async () => {
    setGalleryOpen(true);
    setIsLoadingGallery(true);

    try {
      const { data, error } = await supabase.storage
        .from("blog-images")
        .list("blog", {
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const imageUrls = data.map(item => {
        const { data: urlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(`blog/${item.name}`);
        return urlData.publicUrl;
      });

      setGalleryImages(imageUrls);
    } catch (error) {
      console.error("Error loading gallery images:", error);
      toast({
        title: "Failed to load images",
        description: "There was an error loading the image gallery",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const handleSelectImage = (url: string) => {
    onImageSelected(url);
    setGalleryOpen(false);
    toast({
      title: "Image selected",
      description: "The image has been set as the featured image",
    });
  };

  const handleRemoveImage = () => {
    onImageSelected("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        {currentImage ? (
          <div className="relative">
            <img 
              src={currentImage} 
              alt="Featured image" 
              className="w-full h-64 object-cover rounded-md" 
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              type="button"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
            <Image className="h-12 w-12 mb-2 opacity-50" />
            <p>No featured image selected</p>
            <p className="text-sm">Upload an image or select from gallery</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Input
            ref={fileInputRef}
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          <Button 
            type="button" 
            variant="secondary"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? `Uploading... ${uploadProgress}%` : "Upload Image"}
          </Button>
        </div>
        <Button 
          type="button" 
          variant="outline"
          onClick={handleOpenGallery}
        >
          <Image className="h-4 w-4 mr-2" />
          Select from Gallery
        </Button>
      </div>

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Gallery</DialogTitle>
          </DialogHeader>
          {isLoadingGallery ? (
            <div className="h-96 flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading images...</span>
            </div>
          ) : galleryImages.length > 0 ? (
            <ScrollArea className="h-96">
              <div className="grid grid-cols-3 gap-4">
                {galleryImages.map((url, index) => (
                  <div 
                    key={index}
                    className="relative group cursor-pointer border rounded-md overflow-hidden"
                    onClick={() => handleSelectImage(url)}
                  >
                    <img 
                      src={url} 
                      alt={`Gallery image ${index}`} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    {currentImage === url && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">Current</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No images found in gallery
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
