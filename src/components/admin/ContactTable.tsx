
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ZapierWebhookSetup } from "./ZapierWebhookSetup";
import { PaginatedTable } from "./PaginatedTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EditContactDialog } from "./EditContactDialog";
import { DeleteContactDialog } from "./dialogs/DeleteContactDialog";

interface ContactSubmission {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  message: string;
  company: string;
  phone: string;
  date: string;
}

export function ContactTable() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContactSubmissions();
  }, []);

  async function fetchContactSubmissions() {
    setLoading(true);
    // Try to fetch from the 'contact_submissions' table
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("date", { ascending: false });
    if (error) {
      console.error("Error fetching contact submissions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch contact submissions",
        variant: "destructive",
      });
      setSubmissions([]);
      setFilteredSubmissions([]);
    } else {
      const formattedData = data.map((item: any) => ({
        ...item,
        name: `${item.firstname} ${item.lastname}`
      }));
      setSubmissions(formattedData);
      setFilteredSubmissions(formattedData);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubmissions(submissions);
    } else {
      const filtered = submissions.filter(
        (submission: ContactSubmission) =>
          (submission.firstname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.lastname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.message || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.company || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubmissions(filtered);
    }
  }, [searchQuery, submissions]);

  const handleEditContact = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setEditDialogOpen(true);
  };

  const handleDeleteContact = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setDeleteDialogOpen(true);
  };

  const handleContactUpdate = async () => {
    await fetchContactSubmissions();
    setEditDialogOpen(false);
  };

  const handleContactDelete = async () => {
    await fetchContactSubmissions();
    setDeleteDialogOpen(false);
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof ContactSubmission,
      cell: (submission: ContactSubmission) => (
        <button 
          className="text-primary hover:underline text-left font-medium"
          onClick={() => handleEditContact(submission)}
        >
          {submission.firstname} {submission.lastname}
        </button>
      ),
    },
    {
      header: "Email",
      accessorKey: "email" as keyof ContactSubmission,
    },
    {
      header: "Company",
      accessorKey: "company" as keyof ContactSubmission,
      cell: (submission: ContactSubmission) => (
        submission.company || "—"
      ),
    },
    {
      header: "Message",
      accessorKey: "message" as keyof ContactSubmission,
      cell: (submission: ContactSubmission) => (
        <div className="max-w-xs truncate">{submission.message}</div>
      ),
    },
    {
      header: "Date",
      accessorKey: "date" as keyof ContactSubmission,
      cell: (submission: ContactSubmission) => (
        submission.date
          ? new Date(submission.date).toLocaleDateString()
          : "—"
      ),
    },
    {
      header: "",
      accessorKey: "actions" as keyof ContactSubmission,
      cell: (item: ContactSubmission) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEditContact(item);
            }}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit contact</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteContact(item);
            }}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete contact</span>
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Submissions</CardTitle>
          <CardDescription>
            View all contact form inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by name, email, company or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <PaginatedTable
            data={filteredSubmissions}
            columns={columns}
            loading={loading}
            searchQuery={searchQuery}
            caption="A list of contact form submissions."
            noDataMessage="No submissions yet."
          />
        </CardContent>
      </Card>
      
      {selectedContact && (
        <>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <EditContactDialog 
                contact={selectedContact}
                onSave={handleContactUpdate}
                onClose={() => setEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DeleteContactDialog 
                contact={selectedContact}
                onDelete={handleContactDelete}
                onClose={() => setDeleteDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      )}

      <ZapierWebhookSetup 
        webhookType="contact" 
        description="Connect your contact form to this admin dashboard" 
      />
    </div>
  );
}
