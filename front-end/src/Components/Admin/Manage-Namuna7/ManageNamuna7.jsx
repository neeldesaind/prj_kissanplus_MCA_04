import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";

export default function ManageNamuna7() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applications, setApplications] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split("T")[0];

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

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-lg mb-10 text-sm">

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Manage Namuna 7 Applications
      </h2>

      {/* Start Date Picker */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Start Date</label>
        <input
          type="date"
          className="w-full p-3 border rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={today}
          required
        />
      </div>

      {/* End Date Picker */}
      <div className="mb-6">
        <label className="block font-medium mb-2">End Date</label>
        <input
          type="date"
          className="w-full p-3 border rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || today}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 text-sm"
      >
        Submit
      </button>

      {/* DataTable for displaying applications */}
      <div className="mt-6">
        <DataTable
          title="Manage Applications"
          columns={columns}
          data={applications}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
}
