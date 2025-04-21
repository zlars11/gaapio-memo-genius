
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
import { Badge } from "@/components/ui/badge";

interface UserSignup {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "active" | "inactive" | "trial";
  signupDate: string;
}

export function UserSignupsTable() {
  const [users, setUsers] = useState<UserSignup[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSignup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - this would be replaced with actual API calls to Stripe
  useEffect(() => {
    // Simulate getting data from localStorage (would be a Stripe API in real app)
    const savedUsers = localStorage.getItem("userSignups");
    
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers);
      setFilteredUsers(parsedUsers);
    } else {
      // Create mock data if none exists
      const mockData: UserSignup[] = [
        { 
          id: "usr_1", 
          name: "Jennifer Adams", 
          email: "jennifer@techinc.com", 
          plan: "Enterprise", 
          status: "active",
          signupDate: "2025-03-15" 
        },
        { 
          id: "usr_2", 
          name: "Thomas Baker", 
          email: "thomas@financegroup.com", 
          plan: "Professional", 
          status: "trial",
          signupDate: "2025-04-01" 
        },
        { 
          id: "usr_3", 
          name: "Lisa Wong", 
          email: "lisa@accountingfirm.com", 
          plan: "Team", 
          status: "active",
          signupDate: "2025-03-20" 
        }
      ];
      
      localStorage.setItem("userSignups", JSON.stringify(mockData));
      setUsers(mockData);
      setFilteredUsers(mockData);
    }
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.plan.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Get status badge variant
  const getStatusBadgeVariant = (status: UserSignup['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trial':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Sign-ups</CardTitle>
        <CardDescription>
          Users who have signed up for a paid plan via Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search by name, email or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <Table>
          <TableCaption>A list of users who have signed up.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sign-up Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.plan}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.signupDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  {searchQuery ? "No matching users found." : "No users have signed up yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
