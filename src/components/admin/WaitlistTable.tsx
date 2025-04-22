import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ZapierWebhookSetup } from "./ZapierWebhookSetup";

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
          <Table>
            <TableCaption>A list of waitlist submissions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission: WaitlistSubmission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.company}</TableCell>
                    <TableCell>
                      {submission.date
                        ? new Date(submission.date).toLocaleDateString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    {searchQuery ? "No matching submissions found." : "No submissions yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ZapierWebhookSetup 
        webhookType="waitlist" 
        description="Connect your waitlist form to this admin dashboard" 
      />
    </div>
  );
}
