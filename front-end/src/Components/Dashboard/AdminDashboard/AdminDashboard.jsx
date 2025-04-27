import { useEffect, useState } from 'react'; 
import axios from 'axios'; 
import { FaUsers, FaDatabase } from 'react-icons/fa'; 
import { MdPublic } from 'react-icons/md'; 
import { GiMapleLeaf, GiVillage, GiWaterfall } from 'react-icons/gi'; 
import PropTypes from 'prop-types'; 
import { FaMapMarkedAlt } from "react-icons/fa";
import loadingAnime from '../../../assets/lottie/loadingAnime.json';
import Lottie from 'lottie-react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/dashboarddata/admin-data`);
        setDashboardData(res.data);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );
  }

  const { paid = 0, pending = 0, applications = {}, usersByRole = [], totalLocations = {} } = dashboardData;
  const { form12 = {}, namuna = {}, noc = {}, exemption = {} } = applications;

  return (
    <div className="p-6 ml-50">
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

        {/* Payments Section */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Payments</h3>
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm mb-8">
          <FaUsers className="text-3xl text-blue-600 mb-2" />
          <h4 className="text-lg font-semibold text-blue-800">Total Income</h4>
          <p className="text-2xl font-semibold text-blue-600">
            ₹{paid} Paid / ₹{pending} Pending
          </p>
        </div>

        {/* Applications Section */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Applications</h3>
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
            bg="pink" 
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

        {/* User Role-wise Section */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2">User Role-wise Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {usersByRole.map(({ _id, count }) => (
            <div key={_id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <FaUsers className="text-3xl text-gray-600 mb-2" />
              <h4 className="text-lg font-semibold text-gray-800">{_id}</h4>
              <p className="text-2xl font-semibold text-gray-600">{count} Users</p>
            </div>
          ))}
        </div>

        {/* Location Statistics */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Locations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <LocationCard title="Total States" count={totalLocations.states} icon={<MdPublic />} />
          <LocationCard title="Total Districts" count={totalLocations.districts} icon={<FaMapMarkedAlt />} />
          <LocationCard title="Total Sub-Districts" count={totalLocations.subDistricts} icon={<GiMapleLeaf />} />
          <LocationCard title="Total Villages" count={totalLocations.villages} icon={<GiVillage />} />
          <LocationCard title="Total Canals" count={totalLocations.canals} icon={<GiWaterfall />} />
        </div>
      </div>
    </div>
  );
};

// ApplicationCard Component
const ApplicationCard = ({ title, submitted = 0, pending = 0, approved = 0, denied = 0, bg = "gray" }) => {
  const bgColor = `bg-${bg}-100`;
  const textColor = `text-${bg}-600`;
  const headingColor = `text-${bg}-800`;

  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-sm`}>
      <FaDatabase className={`text-3xl ${textColor} mb-2`} />
      <h4 className={`text-lg font-semibold ${headingColor}`}>{title}</h4>
      <p className={`text-2xl font-semibold ${textColor}`}>
        Submitted: {submitted} | Pending: {pending} | Approved: {approved} | Denied: {denied}
      </p>
    </div>
  );
};

// LocationCard Component
const LocationCard = ({ title, count, icon }) => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
    {icon && <div className="text-3xl text-gray-600 mb-2">{icon}</div>}
    <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    <p className="text-2xl font-semibold text-gray-600">{count}</p>
  </div>
);

// PropTypes validation
ApplicationCard.propTypes = {
  title: PropTypes.string.isRequired,
  submitted: PropTypes.number,
  pending: PropTypes.number,
  approved: PropTypes.string,
  denied: PropTypes.string,
  bg: PropTypes.string
};

LocationCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  icon: PropTypes.node
};

export default AdminDashboard;
