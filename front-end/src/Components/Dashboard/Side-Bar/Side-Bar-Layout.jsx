import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Side-Bar"; // Correct import

function SideBarLayout() {
  const [userRole, setUserRole] = useState("loading"); // Temporary state to prevent undefined issues

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole") || "farmer"; // Ensure fallback
    setUserRole(storedUserRole.toLowerCase());
  }, []);

  // Prevent rendering Sidebar until userRole is set
  if (userRole === "loading") return null;

  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#1b1c1c] dark:text-white">
      <Sidebar userRole={userRole} />
      <div className="flex-1 bg-gray-100 lg:px-8 min-h-screen overflow-y-auto overflow-x-hidden pt-16 px-4 sm:pt-4 sm:px-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:bg-[#1b1c1c] dark:text-white">
        <div className="w-full max-w-full overflow-hidden dark:bg-[#1b1c1c] dark:text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default SideBarLayout;
