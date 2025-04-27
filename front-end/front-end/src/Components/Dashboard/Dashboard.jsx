import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FarmerDashboard from "./FarmerDashboards/FarmerDashboard"; // Check the path
import KarkoonDashboard from "./KarkoonDashboards/KarkoonDashboard";
import ChowkidarDashboard from "./ChowkidarDashboard/ChowkidarDashboard";
import TalatiDashboard from "./TalatiDashboard/TalatiDashboard";
import EngineerDashboard from "./EngineerDashboard/EngineerDashboard";
import AdminDashboard from "./AdminDashboard/AdminDashboard";

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Check if user is authenticated, otherwise redirect to login
    if (!localStorage.getItem("authToken")) {
      navigate("/login"); // Redirect to login if not authenticated
    }

    // Fetch the role from localStorage
    const userRole = localStorage.getItem("userRole");
    setRole(userRole); // Set the user's role
  }, [navigate]);

  if (role === null) {
    return <div>Loading...</div>; // Show loading state until role is set
  }

  // Render content based on role
  return (
    <div>
      {role === "farmer" ? (
        <FarmerDashboard /> // Render FarmerDashboard when role is 'Farmer'
      ) : role === "karkoon" ? (
        <div>
         <KarkoonDashboard/>
        </div>
      ) : role === "chowkidar" ? (
        <div>
         <ChowkidarDashboard/>
        </div>
      ) : role === "talati" ? (
        <div>
         <TalatiDashboard/>
        </div>
      ) : role === "engineer" ? (
        <div>
         <EngineerDashboard/>
        </div>
      ): role === "admin" ? (
        <div>
         <AdminDashboard/>
        </div>
      ): (
        <div>No valid role found.</div> // Handle invalid roles
      )}
    </div>
  );
}

export default Dashboard;
