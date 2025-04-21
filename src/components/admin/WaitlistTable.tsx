
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

  // Mock data - this would be replaced with actual API calls
  useEffect(() => {
    // Simulate getting data from localStorage (would be an API in real app)
    const savedSubmissions = localStorage.getItem("waitlistSubmissions");
    
    if (savedSubmissions) {
      const parsedSubmissions = JSON.parse(savedSubmissions);
      setSubmissions(parsedSubmissions);
      setFilteredSubmissions(parsedSubmissions);
    } else {
      // Create mock data if none exists
      const mockData: WaitlistSubmission[] = [
        { 
          id: "1", 
          name: "Jane Smith", 
          email: "jane.smith@example.com", 
          company: "Tech Corp", 
          date: "2025-04-15" 
        },
        { 
          id: "2", 
          name: "John Doe", 
          email: "john.doe@example.com", 
          company: "Finance Inc", 
          date: "2025-04-16" 
        },
        { 
          id: "3", 
          name: "Alex Johnson", 
          email: "alex@example.com", 
          company: "Design Studio", 
          date: "2025-04-18" 
        }
      ];
      
      localStorage.setItem("waitlistSubmissions", JSON.stringify(mockData));
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
          submission.company.toLowerCase().includes(searchQuery.toLowerCase())
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
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.company}</TableCell>
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
        webhookType="waitlist" 
        description="Connect your waitlist form to this admin dashboard" 
      />
    </div>
  );
}
