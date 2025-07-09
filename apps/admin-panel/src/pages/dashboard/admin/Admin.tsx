import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const transactions = [
  {
    id: 1,
    amount: "500",
    mod_of_payment: "cash",
    status: "Completed",
    cafe_id: "148714525",
    transaction_id: "14WEFWW1F25",
  },
];

function Transactions() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="mb-6">
       
        <h1 className="text-3xl font-bold text-primary">Admin</h1>
      </div>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email or phone..."
            className="pl-10 py-6 text-lg bg-background text-foreground border-input focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border shadow-sm bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="font-semibold text-muted-foreground">
                ID
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Payment Mode
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Transaction ID
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Cafe ID
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell className="font-medium">
                  {transaction.amount}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.mod_of_payment}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.status}
                </TableCell>

                <TableCell className="font-medium underline hover:text-primary hover:cursor-pointer transition">
                  {transaction.transaction_id}
                </TableCell>

                <TableCell className="font-medium flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" className="px-4 py-2 text-sm">
                        View
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-primary border-2">
                      <span>Cafe ID: {transaction.cafe_id}</span>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Transactions;
