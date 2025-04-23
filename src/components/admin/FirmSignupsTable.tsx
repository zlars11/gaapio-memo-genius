
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function FirmSignupsTable() {
  const [signups, setSignups] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockData = JSON.parse(localStorage.getItem("firmSignups") || "[]");
    setSignups(mockData);
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Firm Name</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signups.map((signup: any) => (
            <TableRow key={signup.id}>
              <TableCell>{signup.firmName}</TableCell>
              <TableCell>{signup.contactName}</TableCell>
              <TableCell>{signup.email}</TableCell>
              <TableCell>{signup.phone}</TableCell>
              <TableCell>{signup.notes || 'No notes'}</TableCell>
              <TableCell>{new Date(signup.date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
