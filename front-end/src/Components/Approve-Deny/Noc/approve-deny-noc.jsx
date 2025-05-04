import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ReactDataTable from "react-data-table-component";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import loadingAnime from "../../../assets/lottie/loadingAnime.json";
import Lottie from "lottie-react";
import { useDarkMode } from "../../Context/useDarkMode";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const NocApplications = () => {
  const [nocData, setNocData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
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
    const fetchNocs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/noc/all`);
        setNocData(res.data);
        setFilteredData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NOCs:", error);
        toast.error("Failed to load NOCs.");
      }
    };

    fetchNocs();
  }, []);

  

  const exportToExcel = () => {
    const exportData = filteredData.map((row) => {
      const user = row.profile_id?.user_id;
      const fullName = user
        ? `${user.firstName || ""} ${user.middleName || ""} ${user.lastName || ""}`.trim()
        : "Unknown";

      return {
        "NOC ID": row.noc_id,
        "Farmer Name": fullName,
        "Reason for NOC": row.reason_for_noc,
        Status: row.isApprovedbyTalati
          ? "Approved"
          : row.isDenied
          ? "Denied"
          : "Pending",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NOC Applications");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "noc_applications.xlsx");
  };

  useEffect(() => {
    const filtered = nocData.filter((row) => {
      const user = row.profile_id?.user_id;
      if (user && user.firstName) {
        const fullName = `${user.firstName} ${user.middleName || ""} ${user.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      }
      return false;
    });

    setFilteredData(filtered);
  }, [searchTerm, nocData]);

  const getStatus = (row) => {
    if (row.isApprovedbyTalati) {
      return <span className="text-green-600 font-semibold">Approved</span>;
    } else if (row.isDeniedbyTalati) {  // Fixed to use 'isDeniedbyTalati' with lowercase 'b'
      return <span className="text-red-600 font-semibold">Denied</span>;
    } else {
      return <span className="text-orange-500 font-semibold">Pending</span>;
    }
  };
  

  const columns = [
    {
      name: "NOC ID",
      selector: (row) => row.noc_id,
    },
    {
      name: "Farmer Name",
      width: "200px",
      selector: (row) => {
        const user = row.profile_id?.user_id;
        if (user && user.firstName) {
          const { firstName, middleName, lastName } = user;
          return `${firstName} ${middleName || ""} ${lastName || ""}`.trim();
        }
        return "Unknown";
      },
    },
    {
      name: "Reason for NOC",
      selector: (row) => row.reason_for_noc,
    },
    {
      name: "Status",
      cell: (row) => getStatus(row),
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => navigate(`/side-bar/view-noc/${row._id}`)}
        >
          View
        </button>
      ),
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
    <div className="max-w-5xl mx-auto mb-10 mt-6 ml-80 dark:bg-[#1b1c1c] dark:text-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 dark:bg-black dark:text-gray-100">
        <div className="flex justify-between items-center mb-4 dark:bg-black dark:text-gray-100">
          <h1 className="text-2xl font-bold">NOC Applications</h1>
          <button
            className={`${
              filteredData.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 dark:text-gray-100"
            } text-white px-4 py-2 rounded`}
            onClick={exportToExcel}
            disabled={filteredData.length === 0} // Disable if no data
          >
            Export to Excel
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Farmer Name"
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-full dark:bg-black dark:text-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ReactDataTable
          columns={columns}
          data={filteredData}
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

export default NocApplications;
