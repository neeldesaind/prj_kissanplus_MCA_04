import { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useDarkMode } from "../../Context/useDarkMode";

const ContactDetails = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');  // State for search
    const BASE_URL = import.meta.env.VITE_BASE_URL;
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
        const fetchContacts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/contact/fetchcontact`);
                setContacts(response.data);
            } catch (err) {
                setError('Failed to fetch contact details: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Columns for the DataTable
    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Message',
            selector: row => row.message,
            cell: row => (
                <div className="whitespace-normal break-words max-w-xs">{row.message}</div>  // Wrap long messages
            ),
        },
        {
            name: 'Date Submitted',
            selector: row => new Date(row.createdAt).toLocaleString(),
            sortable: true,
        },
    ];

    // Filtering contacts based on the search term
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 ">
            <h2 className="text-3xl font-semibold text-center mb-8">Contact Details</h2>

            {/* Reduced Card Wrapper */}
            <div className="bg-white shadow-lg rounded-lg p-4 max-w-4xl mx-auto dark:bg-black dark:text-gray-100">
                {/* Search Bar Inside the Card */}
                <div className="mb-4 ">
                    <input
                        type="text"
                        placeholder="Search by Name, Email, or Message"
                        className="p-2 w-full border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={filteredContacts}  // Display filtered data
                    pagination
                    customStyles={customStyles}
                    pointerOnHover
                    responsive
                    paginationPerPage={10}
                />
            </div>
        </div>
    );
};

export default ContactDetails;
