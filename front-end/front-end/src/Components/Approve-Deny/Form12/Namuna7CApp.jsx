import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ReactDataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import loadingAnime from "../../../assets/lottie/loadingAnime.json";
import Lottie from "lottie-react";
import { useDarkMode } from "../../Context/useDarkMode";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Namuna7CApp = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateOfSupply, setDateOfSupply] = useState({});
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


  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/namuna7/alll`);
        console.log("Fetched Applications:", res.data); // Log fetched data to verify
        setApplications(res.data);
        setFilteredApplications(res.data); // Set filteredApplications to the fetched data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Form12 applications:", error);
        toast.error("Failed to load Form12 applications.");
      }
    };

    fetchApplications();
  }, []);

  const handleExportToExcel = () => {
    const exportData = filteredApplications.map((row) => ({
      "Farmer Name": row.farmerName || "Unknown",
      "Survey Number": row.surveyNumber || "N/A",
      "Farm Area": row.farmArea || "N/A",
      "Requested Area": row.requestedArea || "N/A",
      "Crop Name": row.cropName || "N/A",
      "Source Type": row.sourceType || "N/A",
      "Date of Supply": row.date_of_supply
        ? new Date(row.date_of_supply).toISOString().split("T")[0]
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Form12Applications");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Form12Applications.xlsx");
  };

  // Filter applications based on search input
  useEffect(() => {
    const filtered = applications.filter((row) => {
      const fullName = `${row.profile_id?.user_id?.firstName || ""} ${
        row.profile_id?.user_id?.middleName || ""
      } ${row.profile_id?.user_id?.lastName || ""}`
        .trim()
        .toLowerCase();
      return fullName.includes(search.toLowerCase());
    });

    setFilteredApplications(filtered);
  }, [search, applications]);

  const handleSave = async (id) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/namuna7/update/${id}`,
        {
          date_of_supply: dateOfSupply[id],
        }
      );
      if (response.data) {
        toast.success("Date of supply updated successfully!");
  
        // Update applications
        const updatedApplications = applications.map((app) =>
          app._id === id ? { ...app, date_of_supply: dateOfSupply[id] } : app
        );
        setApplications(updatedApplications);
  
        // Update filteredApplications
        const updatedFiltered = filteredApplications.map((app) =>
          app._id === id ? { ...app, date_of_supply: dateOfSupply[id] } : app
        );
        setFilteredApplications(updatedFiltered);
      }
    } catch (error) {
      console.error("Error updating date of supply:", error);
      toast.error("Failed to update date of supply.");
    }
  };
  

  const columns = [
    
    {
      name: "Farmer Name",
      selector: (row) => {
        const first = row?.profile_id?.user_id?.firstName || "";
        const middle = row?.profile_id?.user_id?.middleName || "";
        const last = row?.profile_id?.user_id?.lastName || "";
        return `${first} ${middle} ${last}`.trim() || "N/A";
      },
      sortable: true,
    },
    {
      name: "Survey Number",
      selector: (row) => row.farmDetails[0]?.farm_id?.surveyNumber || "N/A",
      sortable: true,
    },
    {
      name: "Farm Area",
      selector: (row) => row.farmDetails[0]?.farm_id?.farmArea || "N/A",
      sortable: true,
    },
    {
      name: "Requested Area",
      selector: (row) => row.farmDetails[0]?.requested_area || "N/A",
      sortable: true,
    },
    {
      name: "Crop Name",
      selector: (row) => row.farmDetails[0]?.crop_name || "N/A",
      sortable: true,
    },
    {
      name: "Source Type",
      selector: (row) => row.source_type || "N/A",
      sortable: true,
    },
    {
      name: "Date of Supply",
      sortable: true,
      cell: (row) => {
        const isDisabled = !!row.date_of_supply; // Disable if already saved
        return (
          <>
            <style>{`
              .dark input[type="date"]::-webkit-calendar-picker-indicator {
                filter: invert(1) brightness(2);
              }
            `}</style>
            <input
              type="date"
              value={
                dateOfSupply[row._id] ||
                (row.date_of_supply
                  ? new Date(row.date_of_supply).toISOString().split("T")[0]
                  : "")
              }
              onChange={(e) =>
                setDateOfSupply({
                  ...dateOfSupply,
                  [row._id]: e.target.value,
                })
              }
              disabled={isDisabled}
              className={`border border-gray-300 rounded px-2 py-1 dark:bg-[#1b1c1c] dark:text-gray-100 ${
                isDisabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
              }`}
            />
          </>
        );
      },
    },

    
    {
      name: "Actions",
      cell: (row) => {
        const isDisabled = !!row.date_of_supply;
        return (
          <button
            onClick={() => handleSave(row._id)}
            disabled={isDisabled}
            className={`px-4 py-2 rounded ${
              isDisabled
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            Save
          </button>
        );
      },
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );

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
    <div className="max-w-6xl mx-auto mt-6 mb-10 ml-70 dark:bg-[#1b1c1c] dark:text-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 text-black dark:bg-black dark:text-gray-100">
        <div className="flex justify-between items-center mb-4 text-black dark:bg-black dark:text-gray-100">
          <h1 className="text-2xl font-bold text-black dark:bg-black dark:text-gray-100">Water Supply Requests</h1>
          <button
            onClick={handleExportToExcel}
            disabled={filteredApplications.length === 0}
            className={`px-4 py-2 rounded ${
              filteredApplications.length === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white "
            }`}
          >
            Export to Excel
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Search by Farmer Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ReactDataTable
          columns={columns}
          data={filteredApplications}
          progressPending={loading}
          pagination
          responsive
          customStyles={customStyles}
          noDataComponent={<NoDataComponent />}
        />
      </div>
    </div>
  );
};

export default Namuna7CApp;
