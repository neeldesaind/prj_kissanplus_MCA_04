import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaWater, FaDatabase } from 'react-icons/fa';
import loadingAnime from '../../../assets/lottie/loadingAnime.json';
import Lottie from 'lottie-react';

const ChowkidarDashboard = () => {
  const [totalRequests, setTotalRequests] = useState(0);
  const [groupedRequests, setGroupedRequests] = useState({}); // Store source-wise grouped requests
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [loading, setLoading] = useState(false);


  // Fetch water requests data
  const fetchWaterRequestsData = async () => {
    setLoading(true); 
    try {
      const res = await axios.get(`${BASE_URL}/api/dashboarddata/water-requests`);
      setTotalRequests(res.data.totalRequests);
      setGroupedRequests(res.data.groupedRequests);
    } catch (error) {
      console.error('Failed to fetch water requests data:', error);
    }finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchWaterRequestsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );
  }

  return (
    <div className="p-6 ml-30 dark:bg-[#1b1c1c] dark:text-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-sm max-w-3xl mx-auto dark:bg-black dark:text-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:bg-black dark:text-gray-100">Chowkidar Dashboard</h2>

        {/* Total Water Requests */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6 dark:bg-black dark:text-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:bg-black dark:text-gray-100">Water Requests Overview</h3>
          <div className="bg-blue-100 p-4 rounded-lg shadow-sm hover:bg-blue-200 transition duration-300">
            <FaWater className="text-3xl text-blue-600 mb-2" />
            <h3 className="text-lg font-semibold text-blue-800">Total Water Requests</h3>
            <p className="text-2xl font-semibold text-blue-600">
              {totalRequests}
            </p>
          </div>
        </div>

        {/* Source-wise Requests */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6 dark:bg-black dark:text-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:bg-black dark:text-gray-100">Source-wise Water Requests</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(groupedRequests).map((sourceType) => (
              <div
                key={sourceType}
                className="bg-green-100 p-4 rounded-lg shadow-sm hover:bg-green-200 transition duration-300"
              >
                <FaDatabase className="text-3xl text-green-600 mb-2" />
                <h3 className="text-lg font-semibold text-green-800">{sourceType}</h3>
                <p className="text-2xl font-semibold text-green-600">
                  {groupedRequests[sourceType]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChowkidarDashboard;
