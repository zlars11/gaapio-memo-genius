
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface PageSeoFormProps {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  onChange: (field: string, value: string) => void;
}

export function PageSeoForm({ 
  metaTitle, 
  metaDescription, 
  canonicalUrl = "",
  onChange 
}: PageSeoFormProps) {
  const [titleLength, setTitleLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);
  
  // Calculate length percentages
  const maxTitleLength = 60;
  const maxDescriptionLength = 160;
  
  const titleProgress = Math.min((metaTitle.length / maxTitleLength) * 100, 100);
  const descriptionProgress = Math.min((metaDescription.length / maxDescriptionLength) * 100, 100);
  
  // Update length counters when props change
  useEffect(() => {
    setTitleLength(metaTitle.length);
    setDescriptionLength(metaDescription.length);
  }, [metaTitle, metaDescription]);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="metaTitle" className="text-base font-medium">Meta Title</Label>
          <span 
            className={`text-xs ${
              titleLength > maxTitleLength ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {titleLength}/{maxTitleLength}
          </span>
        </div>
        <Input 
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => {
            setTitleLength(e.target.value.length);
            onChange("metaTitle", e.target.value);
          }}
          placeholder="Enter meta title (recommended 50-60 characters)"
        />
        <Progress 
          value={titleProgress} 
          className={`h-1 ${titleLength > maxTitleLength ? "bg-destructive" : ""}`}
        />
        {titleLength > maxTitleLength && (
          <p className="text-xs text-destructive mt-1">
            Title exceeds recommended length
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="metaDescription" className="text-base font-medium">Meta Description</Label>
          <span 
            className={`text-xs ${
              descriptionLength > maxDescriptionLength ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {descriptionLength}/{maxDescriptionLength}
          </span>
        </div>
        <Textarea 
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => {
            setDescriptionLength(e.target.value.length);
            onChange("metaDescription", e.target.value);
          }}
          placeholder="Enter meta description (recommended 120-160 characters)"
          className="min-h-[100px]"
        />
        <Progress 
          value={descriptionProgress} 
          className={`h-1 ${descriptionLength > maxDescriptionLength ? "bg-destructive" : ""}`}
        />
        {descriptionLength > maxDescriptionLength && (
          <p className="text-xs text-destructive mt-1">
            Description exceeds recommended length
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="canonicalUrl" className="text-base font-medium">Canonical URL (Optional)</Label>
        <Input 
          id="canonicalUrl"
          value={canonicalUrl}
          onChange={(e) => onChange("canonicalUrl", e.target.value)}
          placeholder="https://example.com/page-url"
        />
        <p className="text-xs text-muted-foreground">
          Use when this page should be treated as a duplicate of another URL
        </p>
      </div>
    </div>
  );
}
