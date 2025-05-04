import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
import { useDarkMode } from "../../Context/useDarkMode";

export default function ManageNamuna7() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applications, setApplications] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split("T")[0];
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


  // Fetch the applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/manageNamuna`);
        setApplications(response.data);
      } catch (error) {
        toast.error("Error fetching applications");
        console.error(error);
      }
    };

    fetchApplications();
  }, [BASE_URL]);

  // Handle Add or Update Submit
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please fill in both dates!");
      return;
    }
    if (new Date(startDate) < new Date()) {
      toast.error("Start date must be greater than today.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date must not be less than the start date.");
      return;
    }
  
    try {
  
      // Check if the record already exists based on the startDate and endDate
      const existingApplication = applications.find(
        (app) => app.startDate === startDate && app.endDate === endDate
      );
  
      if (existingApplication) {
        // If the application exists, update it
        await axios.put(
          `${BASE_URL}/api/manageNamuna/update/${existingApplication._id}`,
          { startDate, endDate }
        );
  
        toast.success("Application updated successfully!");
      } else {
        // If no existing application, create a new one
        await axios.post(`${BASE_URL}/api/manageNamuna/createOrUpdate`, {
          startDate,
          endDate,
        });
  
        toast.success("Dates updated successfully!");
      }
  
      // Fetch the updated applications after submit
      const updatedApplications = await axios.get(`${BASE_URL}/api/manageNamuna`);
      setApplications(updatedApplications.data); // Update the state with the latest data
  
    } catch (error) {
      toast.error("There was an error processing your request.");
      console.error("Error:", error);
    }
  };
  

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/manageNamuna/delete/${id}`);
      // Remove deleted application from state
      setApplications((prev) => prev.filter((app) => app._id !== id));
      toast.success("Application deleted successfully!");
    } catch (error) {
      toast.error("Error deleting application");
      console.error(error);
    }
  };

  // DataTable columns configuration
  const columns = [
    {
      name: "Start Date",
      selector: (row) => new Date(row.startDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.endDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            onClick={() => handleDelete(row._id)}
            className="bg-red-500 text-white p-2 rounded mr-2"
          >
            Delete
          </button>
        </div>
      ),
    },
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
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-lg mb-10 text-sm dark:bg-black dark:text-gray-100">

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:bg-black dark:text-gray-100">
        Manage Namuna 7 Applications
      </h2>

      {/* Start Date Picker */}
      <div className="mb-4 dark:bg-black dark:text-gray-100">
        <label className="block font-medium mb-2 dark:bg-black dark:text-gray-100">Start Date</label>
        <input
          type="date"
          className="w-full p-3 border rounded dark:bg-black dark:text-gray-100"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={today}
          required
        />
      </div>

      {/* End Date Picker */}
      <div className="mb-6 dark:bg-black dark:text-gray-100">
        <label className="block font-medium mb-2 dark:bg-black dark:text-gray-100">End Date</label>
        <input
          type="date"
          className="w-full p-3 border rounded dark:bg-black dark:text-gray-100"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || today}
          required
        />
      </div>

      <>
  {/* your label and input here */}

      <style>{`
        .dark input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(2);
        }
      `}</style>
    </>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 text-sm"
      >
        Submit
      </button>

      {/* DataTable for displaying applications */}
      <div className="mt-6 dark:bg-black dark:text-gray-100">
        <DataTable
          columns={columns}
          data={applications}
          pagination
          customStyles={customStyles}
          noDataComponent={<NoDataComponent />}
        />
      </div>
    </div>
  );
}
