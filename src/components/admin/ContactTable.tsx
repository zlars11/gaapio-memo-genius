
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ZapierWebhookSetup } from "./ZapierWebhookSetup";
import { PaginatedTable } from "./PaginatedTable";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  company?: string;
}

export function ContactTable() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Try to fetch from the 'contact_submissions' table
      const { data, error } = await (supabase as any)
        .from("contact_submissions")
        .select("*")
        .order("date", { ascending: false });
      if (error) {
        setSubmissions([]);
        setFilteredSubmissions([]);
      } else {
        setSubmissions(data);
        setFilteredSubmissions(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubmissions(submissions);
    } else {
      const filtered = submissions.filter(
        (submission: ContactSubmission) =>
          (submission.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.message || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.company || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubmissions(filtered);
    }
  }, [searchQuery, submissions]);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof ContactSubmission,
      cell: (submission: ContactSubmission) => (
        <span className="font-medium">{submission.name}</span>
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
      <ZapierWebhookSetup 
        webhookType="contact" 
        description="Connect your contact form to this admin dashboard" 
      />
    </div>
  );
}
