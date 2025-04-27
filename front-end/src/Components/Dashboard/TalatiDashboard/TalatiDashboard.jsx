import { useEffect, useState } from "react";
import axios from "axios";
import { FaWater, FaDatabase } from "react-icons/fa";

const TalatiDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/dashboarddata/talati-data`);
      setDashboardData(res.data);
    } catch (error) {
      console.error("Failed to fetch Talati dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  // Extract data safely
  const applications = dashboardData.applications || {};
  const namuna = applications.namuna || {};
  const noc = applications.noc || {};
  const exemption = applications.exemption || {};

  return (
    <div className="p-6 ml-30">
      <div className="bg-white p-4 rounded-lg shadow-sm max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Talati Dashboard
        </h2>

        {/* Total Income Overview */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Income Overview
          </h3>
          <div className="bg-blue-100 p-4 rounded-lg shadow-sm hover:bg-blue-200 transition duration-300">
            <FaWater className="text-3xl text-blue-600 mb-2" />
            <h3 className="text-lg font-semibold text-blue-800">
              Total Income
            </h3>
            <p className="text-2xl font-semibold text-blue-600">
              ₹{dashboardData?.paid ?? 0} Paid / ₹{dashboardData?.pending ?? 0}{" "}
              Pending
            </p>
          </div>
        </div>

        {/* Applications Overview */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Applications Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Namuna Overview */}
            <div className="bg-green-100 p-4 rounded-lg shadow-sm hover:bg-green-200 transition duration-300">
              <FaDatabase className="text-3xl text-green-600 mb-2" />
              <h3 className="text-lg font-semibold text-green-800">Namuna</h3>
              <p className="text-2xl font-semibold text-green-600">
                Submitted: {namuna.submitted || 0} | Pending: {namuna.pending || 0}
              </p>
              <p className="text-2xl font-semibold text-green-600">
                Approved: {namuna.approved || 0} | Denied: {namuna.denied || 0}
              </p>
            </div>

            {/* NOC Overview */}
            <div className="bg-green-100 p-4 rounded-lg shadow-sm hover:bg-green-200 transition duration-300">
              <FaDatabase className="text-3xl text-green-600 mb-2" />
              <h3 className="text-lg font-semibold text-green-800">NOC</h3>
              <p className="text-2xl font-semibold text-green-600">
                Submitted: {noc.submitted || 0} | Pending: {noc.pending || 0}
              </p>
              <p className="text-2xl font-semibold text-green-600">
                Approved: {noc.approved || 0} | Denied: {noc.denied || 0}
              </p>
            </div>

            {/* Exemption Overview */}
            <div className="bg-green-100 p-4 rounded-lg shadow-sm hover:bg-green-200 transition duration-300">
              <FaDatabase className="text-3xl text-green-600 mb-2" />
              <h3 className="text-lg font-semibold text-green-800">Exemption</h3>
              <p className="text-2xl font-semibold text-green-600">
                Submitted: {exemption.submitted || 0} | Pending: {exemption.pending || 0}
              </p>
              <p className="text-2xl font-semibold text-green-600">
                Approved: {exemption.approved || 0} | Denied: {exemption.denied || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Total Users Overview */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Total Users
          </h3>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-sm hover:bg-yellow-200 transition duration-300">
            <FaDatabase className="text-3xl text-yellow-600 mb-2" />
            <h3 className="text-lg font-semibold text-yellow-800">
              Total Users
            </h3>
            <p className="text-2xl font-semibold text-yellow-600">
              {dashboardData.totalUsers || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalatiDashboard;
