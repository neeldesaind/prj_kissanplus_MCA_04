import { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component'; // Import the DataTable component
import loadingAnime from '../../../assets/lottie/loadingAnime.json';
import Lottie from 'lottie-react'; // Import Lottie for loading animation

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]); // State for filtered data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const BASE_URL = import.meta.env.VITE_BASE_URL; // Assuming you have a BASE_URL environment variable


  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/payments`);
        setPayments(response.data);
        setFilteredPayments(response.data); // Set filtered payments initially to all payments
        setLoading(false);
      } catch (err) {
        setError('Error fetching payment records',err);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchTerm(searchQuery);

    // Filter payments based on the search term (farmer's name)
    const filteredData = payments.filter(payment =>
      payment.user.name.toLowerCase().includes(searchQuery)
    );
    setFilteredPayments(filteredData);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );
  if (error) return <div>{error}</div>;

  // Define columns for DataTable with Tailwind CSS classes
  const columns = [
    {
      name: 'Full name',
      selector: row => row.user.name,
      sortable: true,
      cellClass: 'px-2 py-1 border text-sm',
    },
    {
      name: 'Amount',
      selector: row => row.amount,
      sortable: true,
      cellClass: 'px-2 py-1 border text-sm',
    },
    {
      name: 'Payment Date',
      selector: row => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      cellClass: 'px-2 py-1 border text-sm',
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: (row) => (
        <div className={`px-2 py-1 text-sm ${row.status === 'success' ? 'text-green-500 font-semibold' : ''}`}>
          {row.status}
        </div>
      ),
    }
  ];

  return (
    <div className="p-4 mx-auto w-full max-w-5xl ml-75"> {/* Container for centering */}
      <div className="bg-white p-6 rounded-lg shadow-lg"> {/* White card with shadow */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Payments List</h2>

        {/* Search bar inside the card */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Farmer Name"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border rounded-md w-full text-sm"
          />
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={filteredPayments}  
          pagination
          highlightOnHover
          responsive
          pointerOnHover
          className="table-auto text-sm" // Added more compact styling
        />
      </div>
    </div>
  );
};

export default PaymentsList;
