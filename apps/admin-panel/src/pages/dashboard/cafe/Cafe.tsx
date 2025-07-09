import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Copy, Pencil, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const cafes = [
  {
    id: 1,
    cafeName: "Dora Resto",
    ownerName: "Nihal Chaudhary",
    LicenseNo: "1234657897645",
    expireDate: "08-08-2020",
  },
  {
    id: 2,
    cafeName: "Dora Resto",
    ownerName: "Nihal Chaudhary",
    LicenseNo: "1234657897645",
    expireDate: "08-08-2020",
  },
  {
    id: 3,
    cafeName: "Dora Resto",
    ownerName: "Nihal Chaudhary",
    LicenseNo: "1234657897645",
    expireDate: "08-08-2020",
  },
];

function Cafe() {
  const handleCopyLicense = (license: string) => {
    navigator.clipboard.writeText(license);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Cafes</h1>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email or phone..."
            className="pl-10 py-6 text-lg bg-background focus-visible:ring-primary w-full"
          />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm h-10 w-full md:w-auto">
          Add New User
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Cafe Name</TableHead>
              <TableHead className="font-semibold">License No</TableHead>
              <TableHead className="font-semibold">Expire Date</TableHead>
              <TableHead className="font-semibold">Owner Name</TableHead>
              <TableHead className="text-center font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cafes.map((cafe) => (
              <TableRow
                key={cafe.id}
                className="hover:bg-muted transition-colors"
              >
                <TableCell className="font-medium">{cafe.id}</TableCell>
                <TableCell className="font-medium">{cafe.cafeName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">******</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast("License number copied to clipboard", {
                          position: "bottom-center",
                        });
                        handleCopyLicense(cafe.LicenseNo);
                      }}
                      className="hover:text-primary hover:bg-muted"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {cafe.expireDate}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <User className="h-4 w-4" />
                    <span>{cafe.ownerName}</span>
                  </div>
                </TableCell>
                <TableCell className="flex justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:text-primary flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Cafe;
