
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ZapierWebhookSetup } from "./ZapierWebhookSetup";
import { PaginatedTable } from "./PaginatedTable";

interface WaitlistSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  date: string;
}

export function WaitlistTable() {
  const [submissions, setSubmissions] = useState<WaitlistSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<WaitlistSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch live data from Supabase instead of localStorage
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Try to fetch from the 'waitlist_submissions' table
      const { data, error } = await (supabase as any)
        .from("waitlist_submissions")
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
        (submission: WaitlistSubmission) =>
          (submission.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.company || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubmissions(filtered);
    }
  }, [searchQuery, submissions]);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof WaitlistSubmission,
      cell: (submission: WaitlistSubmission) => (
        <span className="font-medium">{submission.name}</span>
      ),
    },
    {
      header: "Email",
      accessorKey: "email" as keyof WaitlistSubmission,
    },
    {
      header: "Company",
      accessorKey: "company" as keyof WaitlistSubmission,
      cell: (submission: WaitlistSubmission) => (
        submission.company || "—"
      ),
    },
    {
      header: "Date",
      accessorKey: "date" as keyof WaitlistSubmission,
      cell: (submission: WaitlistSubmission) => (
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
          <CardTitle>Waitlist Submissions</CardTitle>
          <CardDescription>
            View all users who have joined the waitlist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by name, email or company..."
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
            caption="A list of waitlist submissions."
            noDataMessage="No submissions yet."
          />
        </CardContent>
      </Card>
      <ZapierWebhookSetup 
        webhookType="waitlist" 
        description="Connect your waitlist form to this admin dashboard" 
      />
    </div>
  );
}
