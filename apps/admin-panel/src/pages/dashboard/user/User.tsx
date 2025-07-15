import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CreateUserPopup from "./CreateUser";

const users = [
  {
    id: 1,
    firstName: "Nihal",
    lastName: "Chaudhary",
    phone: "+91 989873099",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    firstName: "Nihal",
    lastName: "Chaudhary",
    phone: "+91 989873099",
    email: "john.doe@example.com",
  },
  {
    id: 3,
    firstName: "Nihal",
    lastName: "Chaudhary",
    phone: "+91 989873099",
    email: "john.doe@example.com",
  },
];

function User() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Users</h1>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email or phone..."
          className="pl-10 py-6 text-lg bg-background text-foreground border-input focus-visible:ring-ring"
          />
        </div>
        <CreateUserPopup />
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="text-center font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-muted transition-colors"
              >
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-col md:flex-row md:items-center justify-center gap-6">
                    <button
                      className="text-foreground hover:text-primary hover:bg-muted flex items-center gap-2 px-3 py-1 rounded"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <Switch id={`block-${user.id}`} />
                      <Label htmlFor={`block-${user.id}`}>Block</Label>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default User;
