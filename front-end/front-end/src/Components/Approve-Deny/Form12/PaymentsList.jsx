import { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component'; // Import the DataTable component
import loadingAnime from '../../../assets/lottie/loadingAnime.json';
import Lottie from 'lottie-react'; // Import Lottie for loading animation
import { useDarkMode } from "../../Context/useDarkMode";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]); // State for filtered data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const BASE_URL = import.meta.env.VITE_BASE_URL; // Assuming you have a BASE_URL environment variable
  const { theme } = useDarkMode();


 const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);


 const customStyles = {
  table: {
    style: {
      backgroundColor: isDarkMode ? "#1b1c1c" : "#fff",
    },
  },
  headRow: {
    style: {
      backgroundColor: isDarkMode ? "#2c2c2c" : "#f0f0f0",
      color: isDarkMode ? "#fff" : "#000",
    },
  },
  headCells: {
    style: {
      color: isDarkMode ? "#fff" : "#000",
    },
  },
  rows: {
    style: {
      backgroundColor: isDarkMode ? "#1b1c1c" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    },
  },
  pagination: {
    style: {
      backgroundColor: isDarkMode ? "#1b1c1c" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    },
  },
};



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

  const NoDataComponent = () => (
    <div
      className={`w-full py-2 text-center text-xl font-semibold ${
        isDarkMode ? "text-gray-300 bg-[#1b1c1c]" : "text-gray-600 bg-white"
      }`}
    >
      There are no records to display
    </div>
  );


  return (
    <div className="p-4 mx-auto w-full max-w-5xl ml-75 dark:bg-[#1b1c1c] dark:text-gray-100"> {/* Container for centering */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-black dark:text-gray-100"> {/* White card with shadow */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:bg-black dark:text-gray-100">Payments List</h2>

        {/* Search bar inside the card */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Farmer Name"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border rounded-md w-full text-sm dark:bg-black dark:text-gray-100"
          />
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={filteredPayments}  
          pagination
          responsive
          pointerOnHover
          customStyles={customStyles}
          noDataComponent={<NoDataComponent />} 
          className="table-auto text-sm dark:bg-black dark:text-gray-100" // Added more compact styling
        />
      </div>
    </div>
  );
};

export default PaymentsList;
