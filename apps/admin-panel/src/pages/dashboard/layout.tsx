import Sidebar from "@/components/const/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};

export default DashboardLayout;
