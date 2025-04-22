
import { useState, useEffect } from "react";
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

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export function ContactTable() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Only use actual submissions from localStorage.
    const savedSubmissions = localStorage.getItem("contactSubmissions");
    let parsed: ContactSubmission[] = [];
    if (savedSubmissions) {
      try {
        parsed = JSON.parse(savedSubmissions);
        if (Array.isArray(parsed)) {
          parsed = parsed.filter(
            (s) => s && typeof s.email === "string" && typeof s.id === "string"
          );
        } else {
          parsed = [];
        }
      } catch {
        parsed = [];
      }
    }
    setSubmissions(parsed);
    setFilteredSubmissions(parsed);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubmissions(submissions);
    } else {
      const filtered = submissions.filter(
        (submission) =>
          (submission.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (submission.message || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubmissions(filtered);
    }
  }, [searchQuery, submissions]);

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
              placeholder="Search by name, email or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <Table>
            <TableCaption>A list of contact form submissions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.name || "—"}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{submission.message}</TableCell>
                    <TableCell>{new Date(submission.date).toLocaleDateString()}</TableCell>
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
        webhookType="contact" 
        description="Connect your contact form to this admin dashboard" 
      />
    </div>
  );
}
