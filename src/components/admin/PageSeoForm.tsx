
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  const idealMinDescriptionLength = 140;
  
  const titleProgress = Math.min((metaTitle.length / maxTitleLength) * 100, 100);
  const descriptionProgress = Math.min((metaDescription.length / maxDescriptionLength) * 100, 100);
  
  // Update length counters when props change
  useEffect(() => {
    setTitleLength(metaTitle.length);
    setDescriptionLength(metaDescription.length);
  }, [metaTitle, metaDescription]);

  const getTitleStatus = () => {
    if (titleLength === 0) return { status: "empty", label: "Empty" };
    if (titleLength > maxTitleLength) return { status: "error", label: "Too Long" };
    if (titleLength < 30) return { status: "warning", label: "Too Short" };
    return { status: "success", label: "Good" };
  };
  
  const getDescriptionStatus = () => {
    if (descriptionLength === 0) return { status: "empty", label: "Empty" };
    if (descriptionLength > maxDescriptionLength) return { status: "error", label: "Too Long" };
    if (descriptionLength < idealMinDescriptionLength) return { status: "warning", label: "Too Short" };
    return { status: "success", label: "Good" };
  };
  
  const titleStatus = getTitleStatus();
  const descriptionStatus = getDescriptionStatus();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="metaTitle" className="text-base font-medium">Meta Title</Label>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${
              titleStatus.status === "error" ? "text-destructive" : "text-muted-foreground"
            }`}>
              {titleLength}/{maxTitleLength}
            </span>
            <Badge variant={titleStatus.status === "success" ? "default" : 
                   titleStatus.status === "warning" ? "outline" : 
                   titleStatus.status === "error" ? "destructive" : "secondary"}>
              {titleStatus.label}
            </Badge>
          </div>
        </div>
        <Input 
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => {
            setTitleLength(e.target.value.length);
            onChange("metaTitle", e.target.value);
          }}
          placeholder="Enter meta title (recommended 50-60 characters)"
          className={titleStatus.status === "error" ? "border-destructive" : ""}
        />
        <Progress 
          value={titleProgress} 
          className={`h-1 ${titleLength > maxTitleLength ? "bg-destructive" : ""}`}
        />
        {titleStatus.status === "error" && (
          <p className="text-xs text-destructive mt-1">
            Title exceeds recommended length
          </p>
        )}
        {titleStatus.status === "warning" && (
          <p className="text-xs text-amber-500 mt-1">
            Title should be between 30-60 characters for best results
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="metaDescription" className="text-base font-medium">Meta Description</Label>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${
              descriptionStatus.status === "error" ? "text-destructive" : "text-muted-foreground"
            }`}>
              {descriptionLength}/{maxDescriptionLength}
            </span>
            <Badge variant={descriptionStatus.status === "success" ? "default" : 
                   descriptionStatus.status === "warning" ? "outline" : 
                   descriptionStatus.status === "error" ? "destructive" : "secondary"}>
              {descriptionStatus.label}
            </Badge>
          </div>
        </div>
        <Textarea 
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => {
            setDescriptionLength(e.target.value.length);
            onChange("metaDescription", e.target.value);
          }}
          placeholder="Enter meta description (recommended 140-160 characters)"
          className={`min-h-[100px] ${descriptionStatus.status === "error" ? "border-destructive" : ""}`}
        />
        <Progress 
          value={descriptionProgress} 
          className={`h-1 ${descriptionLength > maxDescriptionLength ? "bg-destructive" : ""}`}
        />
        {descriptionStatus.status === "error" && (
          <p className="text-xs text-destructive mt-1">
            Description exceeds recommended length
          </p>
        )}
        {descriptionStatus.status === "warning" && (
          <p className="text-xs text-amber-500 mt-1">
            Description should be between 140-160 characters for best results
          </p>
        )}
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Tips for good meta descriptions:</p>
          <ul className="list-disc ml-4 mt-1 space-y-1">
            <li>Include important keywords (technical accounting, CPA, ASC 606)</li>
            <li>Write in natural language</li>
            <li>Include a call to action where appropriate</li>
          </ul>
        </div>
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
      
      <div className="p-4 bg-muted rounded-md">
        <h3 className="text-sm font-medium mb-2">Open Graph Preview</h3>
        <div className="border rounded-md p-3 bg-background">
          <p className="font-medium text-sm truncate">{metaTitle || "Page Title"}</p>
          <p className="text-xs text-blue-600 truncate">gaapio.com{canonicalUrl || ""}</p>
          <p className="text-xs mt-1 line-clamp-2">{metaDescription || "Page description will appear here."}</p>
        </div>
      </div>
    </div>
  );
}
