import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFileAlt, FaCheckCircle, FaDollarSign } from 'react-icons/fa';

const KarkoonDashboard = () => {
  const [totalSubmittedForm12, setTotalSubmittedForm12] = useState(0);
  const [totalApprovedForm12, setTotalApprovedForm12] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0); // State to hold total income
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const userId = localStorage.getItem('userId');

  // Fetch Form 12 data
  const fetchForm12Data = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/dashboarddata/user/${userId}/form12`);
      setTotalSubmittedForm12(res.data.totalSubmitted || 0);
      setTotalApprovedForm12(res.data.totalApproved || 0);
    } catch (error) {
      console.error('Failed to fetch Form 12 data:', error);
    }
  };

  // Fetch total income from the new API endpoint
  const fetchTotalIncome = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/dashboarddata/total-income`);
      setTotalIncome(res.data.totalIncome || 0); // Update the state with total income
    } catch (error) {
      console.error('Failed to fetch total income data:', error);
    }
  };

  useEffect(() => {
    fetchForm12Data();
    fetchTotalIncome(); // Fetch total income from new API route
  }, [userId]);

  return (
    <div className="p-6 ml-30">
      <div className="bg-white p-4 rounded-lg shadow-sm max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Karkoon Dashboard</h2>

        {/* Form 12 Overview */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Form 12 Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-teal-100 p-4 rounded-lg shadow-sm hover:bg-teal-200 transition duration-300">
              <FaFileAlt className="text-3xl text-teal-600 mb-2" />
              <h3 className="text-lg font-semibold text-teal-800">Form 12 Submitted</h3>
              <p className="text-2xl font-semibold text-teal-600">
                {totalSubmittedForm12}
              </p>
            </div>
            <div className="bg-teal-200 p-4 rounded-lg shadow-sm hover:bg-teal-300 transition duration-300">
              <FaCheckCircle className="text-3xl text-teal-700 mb-2" />
              <h3 className="text-lg font-semibold text-teal-800">Form 12 Approved</h3>
              <p className="text-2xl font-semibold text-teal-700">
                {totalApprovedForm12}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Overview */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Overview</h3>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-sm hover:bg-yellow-200 transition duration-300">
            <FaDollarSign className="text-3xl text-yellow-600 mb-2" />
            <h3 className="text-lg font-semibold text-yellow-800">Total Income</h3>
            <p className="text-2xl font-semibold text-yellow-600">
              ₹{totalIncome.toLocaleString()} {/* Display income in a formatted manner */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KarkoonDashboard;
