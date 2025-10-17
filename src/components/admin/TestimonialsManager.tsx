import { useState } from "react";
import {
  useCustomerTestimonials,
  useDeleteTestimonial,
  deleteTestimonialAvatar,
  CustomerTestimonial,
} from "@/hooks/useCustomerTestimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { TestimonialDialog } from "./TestimonialDialog";

export function TestimonialsManager() {
  const { data: testimonials, isLoading, error, refetch } = useCustomerTestimonials();
  const deleteMutation = useDeleteTestimonial();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<CustomerTestimonial | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] =
    useState<CustomerTestimonial | null>(null);

  const handleAdd = () => {
    setSelectedTestimonial(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (testimonial: CustomerTestimonial) => {
    setSelectedTestimonial(testimonial);
    setDialogOpen(true);
  };

  const handleDeleteClick = (testimonial: CustomerTestimonial) => {
    setTestimonialToDelete(testimonial);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return;

    // Delete avatar from storage if exists
    if (testimonialToDelete.avatar_url) {
      await deleteTestimonialAvatar(testimonialToDelete.avatar_url);
    }

    await deleteMutation.mutateAsync(testimonialToDelete.id);
    setDeleteDialogOpen(false);
    setTestimonialToDelete(null);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">
              {error instanceof Error
                ? error.message
                : "Failed to load customer testimonials. Please check that the database table and storage bucket are properly configured."}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Testimonials</CardTitle>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading testimonials...</p>
            </div>
          ) : !testimonials || testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">
                No testimonials yet. Add your first customer testimonial to get
                started.
              </p>
              <Button onClick={handleAdd} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Testimonial
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={testimonial.avatar_url || undefined} />
                        <AvatarFallback>
                          {testimonial.customer_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{testimonial.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.customer_title}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{testimonial.quote}</p>
                    </TableCell>
                    <TableCell>{testimonial.display_order}</TableCell>
                    <TableCell>
                      <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                        {testimonial.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(testimonial)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TestimonialDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        testimonial={selectedTestimonial}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the testimonial from{" "}
              <strong>{testimonialToDelete?.customer_name}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
