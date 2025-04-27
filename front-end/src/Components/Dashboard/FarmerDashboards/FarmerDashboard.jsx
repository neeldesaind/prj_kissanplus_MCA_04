import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMoneyBillAlt, FaFileAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Lottie from 'lottie-react';
import loadingAnime from '../../../assets/lottie/loadingAnime.json';

const FarmerDashboard = () => {
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);
  const [totalSubmittedNocs, setTotalSubmittedNocs] = useState(0);
  const [totalApprovedNocs, setTotalApprovedNocs] = useState(0);
  const [totalSubmittedNamunas, setTotalSubmittedNamunas] = useState(0);
  const [totalApprovedNamunas, setTotalApprovedNamunas] = useState(0);
  const [totalSubmittedExemptions, setTotalSubmittedExemptions] = useState(0);
  const [totalApprovedExemptions, setTotalApprovedExemptions] = useState(0);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);

  // Fetch Payments Data
  const fetchPayments = async () => {
    
    try {
      const res = await axios.get(`${BASE_URL}/api/dashboarddata/user/${userId}/payments`);
      const amount = res.data.totalPaidAmount || 0;
      const pendingAmount = res.data.totalPendingAmount || 0;

      const paidCount = res.data.payments.filter(payment => payment.status === 'success').length;

      setTotalPaid(paidCount);
      setTotalPendingAmount(pendingAmount);
      setTotalAmountPaid(amount);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  };

  // Fetch NOCs Data
  const fetchNocs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/dashboarddata/user/${userId}/nocs`);
      setTotalSubmittedNocs(res.data.totalSubmitted || 0);
      setTotalApprovedNocs(res.data.totalApproved || 0);
    } catch (error) {
      console.error('Failed to fetch NOCs:', error);
    }
  };

  // Fetch Namunas Data
  const fetchNamunas = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/dashboarddata/user/${userId}/namunas`);
      setTotalSubmittedNamunas(res.data.totalSubmitted || 0);
      setTotalApprovedNamunas(res.data.totalApproved || 0);
    } catch (error) {
      console.error('Failed to fetch Namunas:', error);
    }
  };

  // Fetch Exemptions Data
  const fetchExemptions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/dashboarddata/user/${userId}/exemptions`);
      setTotalSubmittedExemptions(res.data.totalSubmitted || 0);
      setTotalApprovedExemptions(res.data.totalApproved || 0);
    } catch (error) {
      console.error('Failed to fetch Exemptions:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchPayments(),
          fetchNocs(),
          fetchNamunas(),
          fetchExemptions(),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllData();
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );
  }

  return (
    <div className="p-6 ml-30">
      <div className="bg-white p-4 rounded-lg shadow-sm max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Farmer Dashboard</h2>

        {/* Payments Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payments Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded-lg shadow-sm hover:bg-green-200 transition duration-300">
              <FaMoneyBillAlt className="text-3xl text-green-600 mb-2" />
              <h3 className="text-lg font-semibold text-green-800">Total Paid</h3>
              <p className="text-2xl font-semibold text-green-600">{totalPaid}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow-sm hover:bg-red-200 transition duration-300">
              <FaExclamationCircle className="text-3xl text-red-600 mb-2" />
              <h3 className="text-lg font-semibold text-red-800">Total Pending</h3>
              <p className="text-2xl font-semibold text-red-600">₹ {totalPendingAmount.toFixed(2)}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow-sm hover:bg-blue-200 transition duration-300">
              <FaMoneyBillAlt className="text-3xl text-blue-600 mb-2" />
              <h3 className="text-lg font-semibold text-blue-800">Total Amount Paid</h3>
              <p className="text-2xl font-semibold text-blue-600">₹ {totalAmountPaid.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* NOCs Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">NOCs Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-yellow-100 p-4 rounded-lg shadow-sm hover:bg-yellow-200 transition duration-300">
              <FaFileAlt className="text-3xl text-yellow-600 mb-2" />
              <h3 className="text-lg font-semibold text-yellow-800">NOCs Submitted</h3>
              <p className="text-2xl font-semibold text-yellow-600">
                {totalSubmittedNocs}
              </p>
            </div>
            <div className="bg-yellow-200 p-4 rounded-lg shadow-sm hover:bg-yellow-300 transition duration-300">
              <FaCheckCircle className="text-3xl text-yellow-600 mb-2" />
              <h3 className="text-lg font-semibold text-yellow-800">NOCs Approved</h3>
              <p className="text-2xl font-semibold text-yellow-600">
                {totalApprovedNocs} 
              </p>
            </div>
          </div>
        </div>

        {/* Namunas Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Namunas Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-orange-100 p-4 rounded-lg shadow-sm hover:bg-orange-200 transition duration-300">
              <FaFileAlt className="text-3xl text-orange-600 mb-2" />
              <h3 className="text-lg font-semibold text-orange-800">Namunas Submitted</h3>
              <p className="text-2xl font-semibold text-orange-600">
                {totalSubmittedNamunas} 
              </p>
            </div>
            <div className="bg-orange-200 p-4 rounded-lg shadow-sm hover:bg-orange-300 transition duration-300">
              <FaCheckCircle className="text-3xl text-orange-600 mb-2" />
              <h3 className="text-lg font-semibold text-orange-800">Namunas Approved</h3>
              <p className="text-2xl font-semibold text-orange-600">
                {totalApprovedNamunas}
              </p>
            </div>
          </div>
        </div>

        {/* Exemptions Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Exemptions Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-purple-100 p-4 rounded-lg shadow-sm hover:bg-purple-200 transition duration-300">
              <FaFileAlt className="text-3xl text-purple-600 mb-2" />
              <h3 className="text-lg font-semibold text-purple-800">Exemptions Submitted</h3>
              <p className="text-2xl font-semibold text-purple-600">
                {totalSubmittedExemptions}
              </p>
            </div>
            <div className="bg-purple-200 p-4 rounded-lg shadow-sm hover:bg-purple-300 transition duration-300">
              <FaCheckCircle className="text-3xl text-purple-600 mb-2" />
              <h3 className="text-lg font-semibold text-purple-800">Exemptions Approved</h3>
              <p className="text-2xl font-semibold text-purple-600">
                {totalApprovedExemptions} 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
