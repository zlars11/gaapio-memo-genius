
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

  // Mock data - this would be replaced with actual API calls
  useEffect(() => {
    // Simulate getting data from localStorage (would be an API in real app)
    const savedSubmissions = localStorage.getItem("contactSubmissions");
    
    if (savedSubmissions) {
      const parsedSubmissions = JSON.parse(savedSubmissions);
      setSubmissions(parsedSubmissions);
      setFilteredSubmissions(parsedSubmissions);
    } else {
      // Create mock data if none exists
      const mockData: ContactSubmission[] = [
        { 
          id: "1", 
          name: "Michael Brown", 
          email: "michael@example.com", 
          message: "I'm interested in learning more about your ASC 606 solutions.", 
          date: "2025-04-10" 
        },
        { 
          id: "2", 
          name: "Sarah Wilson", 
          email: "sarah@example.com", 
          message: "When do you plan to launch the full product?", 
          date: "2025-04-12" 
        },
        { 
          id: "3", 
          name: "Robert Jones", 
          email: "robert@example.com", 
          message: "Can you tell me more about your pricing plans?", 
          date: "2025-04-14" 
        }
      ];
      
      localStorage.setItem("contactSubmissions", JSON.stringify(mockData));
      setSubmissions(mockData);
      setFilteredSubmissions(mockData);
    }
  }, []);

  // Filter submissions based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubmissions(submissions);
    } else {
      const filtered = submissions.filter(
        (submission) =>
          submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          submission.message.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <TableCell className="font-medium">{submission.name}</TableCell>
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
