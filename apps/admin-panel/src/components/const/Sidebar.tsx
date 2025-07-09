import {
  Sidebar as SideBar,
  SidebarInset,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
} from "../ui/sidebar";
import { Home, User, Coffee, CreditCard, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggler } from "../shared/theme.toggler";
import { Button } from "../ui/button";
import { useSignout } from "@/pages/auth/api";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: User,
  },
  {
    title: "Cafes",
    url: "/dashboard/cafes",
    icon: Coffee,
  },
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: CreditCard,
  },
  {
    title: "Admin",
    url: "/dashboard/admin",
    icon: Shield,
  },
];

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { mutate: signout } = useSignout();

  return (
    <SidebarProvider>
      <SideBar>
        {/* Header */}
        <SidebarHeader className="flex flex-row justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Cafex</h2>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isHome = item.url === "/dashboard";
                  const isActive = isHome
                    ? location.pathname === item.url
                    : location.pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={isActive ? "bg-primary text-white" : ""}
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <ThemeToggler variant="full-width" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button onClick={() => signout()}>Signout</Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SideBar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </header>
        <main className="flex-1 px-2 pt-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Sidebar;
