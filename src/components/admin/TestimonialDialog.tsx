import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import {
  useCreateTestimonial,
  useUpdateTestimonial,
  uploadTestimonialAvatar,
  deleteTestimonialAvatar,
  CustomerTestimonial,
} from "@/hooks/useCustomerTestimonials";

const testimonialSchema = z.object({
  quote: z.string().min(10, "Quote must be at least 10 characters").max(500, "Quote must be less than 500 characters"),
  customer_name: z.string().min(2, "Name is required").max(100, "Name must be less than 100 characters"),
  customer_title: z.string().min(2, "Title is required").max(100, "Title must be less than 100 characters"),
  highlight_words: z.string().optional(),
  display_order: z.coerce.number().min(0, "Display order must be non-negative"),
  is_active: z.boolean(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface TestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: CustomerTestimonial;
}

export function TestimonialDialog({
  open,
  onOpenChange,
  testimonial,
}: TestimonialDialogProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    testimonial?.avatar_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      quote: testimonial?.quote || "",
      customer_name: testimonial?.customer_name || "",
      customer_title: testimonial?.customer_title || "",
      highlight_words: testimonial?.highlight_words?.join(", ") || "",
      display_order: testimonial?.display_order || 0,
      is_active: testimonial?.is_active ?? true,
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      form.setError("root", {
        message: "Image must be less than 5MB",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      form.setError("root", {
        message: "File must be an image",
      });
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: TestimonialFormValues) => {
    try {
      setIsUploading(true);

      // Parse highlight words from comma-separated string
      const highlight_words = values.highlight_words
        ? values.highlight_words
            .split(",")
            .map((w) => w.trim())
            .filter(Boolean)
        : undefined;

      let avatar_url = avatarPreview;

      // Upload avatar if a new file was selected
      if (avatarFile) {
        const tempId = testimonial?.id || crypto.randomUUID();
        avatar_url = await uploadTestimonialAvatar(avatarFile, tempId);

        // Delete old avatar if updating
        if (testimonial?.avatar_url && testimonial.avatar_url !== avatar_url) {
          await deleteTestimonialAvatar(testimonial.avatar_url);
        }
      }

      const inputData = {
        quote: values.quote,
        customer_name: values.customer_name,
        customer_title: values.customer_title,
        highlight_words,
        display_order: values.display_order,
        is_active: values.is_active,
        avatar_url: avatar_url || undefined,
      };

      if (testimonial) {
        await updateMutation.mutateAsync({
          id: testimonial.id,
          ...inputData,
        });
      } else {
        await createMutation.mutateAsync(inputData);
      }

      onOpenChange(false);
      form.reset();
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error("Error saving testimonial:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
          <DialogDescription>
            {testimonial
              ? "Update the testimonial details below"
              : "Add a new customer testimonial to display on your site"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar Upload */}
            <FormItem>
              <FormLabel>Customer Avatar</FormLabel>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback>
                    {form.watch("customer_name")?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeAvatar}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <FormDescription>
                Upload a profile picture (JPG, PNG, WEBP - max 5MB)
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quote</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the customer's testimonial quote..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The testimonial text (10-500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title/Role</FormLabel>
                    <FormControl>
                      <Input placeholder="CFO, Company Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="highlight_words"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlight Words (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="accurate, complete, indispensable"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated words to highlight in the quote
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-2">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription className="text-xs">
                        Show on website
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isUploading ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
                {isUploading
                  ? "Uploading..."
                  : testimonial
                  ? "Update Testimonial"
                  : "Create Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
