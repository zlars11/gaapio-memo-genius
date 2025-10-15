import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUploadCustomerLogo, useUpdateCustomerLogo, CustomerLogo } from "@/hooks/useCustomerLogos";
import { Upload, X } from "lucide-react";

interface CustomerLogoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logo?: CustomerLogo;
}

export function CustomerLogoDialog({ open, onOpenChange, logo }: CustomerLogoDialogProps) {
  const [companyName, setCompanyName] = useState(logo?.company_name || "");
  const [displayOrder, setDisplayOrder] = useState(logo?.display_order?.toString() || "0");
  const [isActive, setIsActive] = useState(logo?.is_active ?? true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(logo?.logo_url || null);

  const uploadMutation = useUploadCustomerLogo();
  const updateMutation = useUpdateCustomerLogo();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (PNG, JPG, SVG, or WebP)");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      alert("Please enter a company name");
      return;
    }

    if (logo) {
      // Update existing logo
      await updateMutation.mutateAsync({
        id: logo.id,
        updates: {
          company_name: companyName,
          display_order: parseInt(displayOrder) || 0,
          is_active: isActive,
        },
      });
    } else {
      // Create new logo
      if (!selectedFile) {
        alert("Please select a logo image");
        return;
      }

      await uploadMutation.mutateAsync({
        file: selectedFile,
        companyName,
        displayOrder: parseInt(displayOrder) || 0,
        isActive,
      });
    }

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setCompanyName("");
    setDisplayOrder("0");
    setIsActive(true);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{logo ? "Edit Customer Logo" : "Add Customer Logo"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display-order">Display Order</Label>
            <Input
              id="display-order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="0"
            />
          </div>

          {!logo && (
            <div className="space-y-2">
              <Label htmlFor="logo-file">Logo Image *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="logo-file"
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg,.webp"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
                {selectedFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Accepts PNG, JPG, SVG, WebP. Max 2MB.
              </p>
            </div>
          )}

          {previewUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-muted/50 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Logo preview"
                  className="max-h-32 max-w-full object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="is-active">Active</Label>
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={uploadMutation.isPending || updateMutation.isPending}
          >
            {uploadMutation.isPending || updateMutation.isPending ? (
              "Saving..."
            ) : logo ? (
              "Update Logo"
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
