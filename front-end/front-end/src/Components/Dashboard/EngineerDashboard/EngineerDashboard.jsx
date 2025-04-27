import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaWater, FaDatabase } from 'react-icons/fa';
import PropTypes from 'prop-types';
import loadingAnime from '../../../assets/lottie/loadingAnime.json';
import Lottie from 'lottie-react';

const EngineerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/dashboarddata/engineer-data`);
        setDashboardData(res.data);
      } catch (error) {
        console.error('Error fetching engineer dashboard data:', error);
      }
    };

    fetchData();
  }, [BASE_URL]);

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );
  }




  const { paid = 0, pending = 0, applications = {}, totalUsers = 0 } = dashboardData;
  const { form12 = {}, namuna = {}, noc = {}, exemption = {} } = applications;

  return (
    <div className="p-6 ml-50 dark:bg-[#1b1c1c] dark:text-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-5xl mx-auto dark:bg-black dark:text-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:bg-black dark:text-gray-100">Engineer Dashboard</h2>

        {/* Payments Section */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2 dark:bg-black dark:text-gray-100">Payments</h3>
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm mb-8">
          <FaWater className="text-3xl text-blue-600 mb-2" />
          <h4 className="text-lg font-semibold text-blue-800">Total Income</h4>
          <p className="text-2xl font-semibold text-blue-600">
            ₹{paid} Paid / ₹{pending} Pending
          </p>
        </div>

        {/* Applications Section */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2 dark:bg-black dark:text-gray-100">Applications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <ApplicationCard 
            title="Form 12 Applications" 
            submitted={form12.submitted} 
            pending={form12.pending} 
            approved={form12.approved} 
            denied={form12.denied} 
            bg="green" 
          />
          <ApplicationCard 
            title="Namuna 7 Applications" 
            submitted={namuna.submitted} 
            pending={namuna.pending} 
            approved={namuna.approved} 
            denied={namuna.denied} 
            bg="purple" 
          />
          <ApplicationCard 
            title="NOC Applications" 
            submitted={noc.submitted} 
            pending={noc.pending} 
            approved={noc.approved} 
            denied={noc.denied} 
            bg="orange" 
          />
          <ApplicationCard 
            title="Exemption Applications" 
            submitted={exemption.submitted} 
            pending={exemption.pending} 
            approved={exemption.approved} 
            denied={exemption.denied} 
            bg="red" 
          />
        </div>

        {/* Users Section */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2 dark:bg-black dark:text-gray-100">Users</h3>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
          <FaDatabase className="text-3xl text-yellow-600 mb-2" />
          <h4 className="text-lg font-semibold text-yellow-800">Total Users</h4>
          <p className="text-2xl font-semibold text-yellow-600">{totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

// ApplicationCard Component with PropTypes validation
const ApplicationCard = ({ title, submitted = 0, pending = 0, approved = 0, denied = 0, bg = "gray" }) => {
  const bgColor = `bg-${bg}-100`;
  const textColor = `text-${bg}-600`;
  const headingColor = `text-${bg}-800`;

  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-sm`}>
      <FaDatabase className={`text-3xl ${textColor} mb-2`} />
      <h4 className={`text-lg font-semibold ${headingColor}`}>{title}</h4>
      <p className={`text-2xl font-semibold ${textColor}`}>
        Submitted: {submitted} | Pending: {pending}
      </p>
      <p className={`text-2xl font-semibold ${textColor}`}>
        Approved: {approved} | Denied: {denied}
      </p>
    </div>
  );
};

// Adding PropTypes validation for ApplicationCard
ApplicationCard.propTypes = {
  title: PropTypes.string.isRequired,
  submitted: PropTypes.number,
  pending: PropTypes.number,
  approved: PropTypes.number,
  denied: PropTypes.number,
  bg: PropTypes.string
};

export default EngineerDashboard;
