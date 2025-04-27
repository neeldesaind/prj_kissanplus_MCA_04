import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ReactDataTable from "react-data-table-component";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import loadingAnime from "../../../assets/lottie/loadingAnime.json";
import Lottie from "lottie-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const NamunaApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/namuna7/all`);
        setApplications(res.data);
        setFilteredApplications(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Namuna applications:", error);
        toast.error("Failed to load Namuna applications.");
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const filtered = applications.filter((row) => {
      const user = row.profile_id?.user_id;
      if (user) {
        const fullName = `${user.firstName} ${user.middleName || ""} ${
          user.lastName || ""
        }`.toLowerCase();
        return fullName.includes(search.toLowerCase());
      }
      return false;
    });

    setFilteredApplications(filtered);
  }, [search, applications]);

  const getStatus = (row) => {
    if (row.isApprovedbyTalati) {
      return <span className="text-green-600 font-semibold">Approved</span>;
    } else if (row.isDeniedbyTalati) {
      return <span className="text-red-600 font-semibold">Denied</span>;
    } else {
      return <span className="text-orange-500 font-semibold">Pending</span>;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );
    
  const columns = [
    {
      name: "Application ID",
      selector: (row) => row.namuna_id || "N/A",
      sortable: true,
    },
    {
      name: "Farmer Name",
      selector: (row) => {
        const user = row.profile_id?.user_id;
        return user
          ? `${user.firstName} ${user.middleName || ""} ${
              user.lastName || ""
            }`.trim()
          : "Unknown";
      },
    },
    {
      name: "Status",
      cell: (row) => getStatus(row),
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => navigate(`/side-bar/view-namuna/${row.namuna_id}`)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          View
        </button>
      ),
    },
  ];

  const exportToExcel = () => {
    const exportData = filteredApplications.map((row) => ({
      "Application ID": row.namuna_id || "N/A",
      "Farmer Name":
        `${row.profile_id?.user_id?.firstName} ${
          row.profile_id?.user_id?.middleName || ""
        } ${row.profile_id?.user_id?.lastName || ""}`.trim() || "Unknown",
      Status: getStatus(row),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Namuna 7 Applications");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "namuna_applications.xlsx");
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 mb-10 ml-80">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Namuna 7 Applications</h1>
          <button
            className={`${
              filteredApplications.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 rounded`}
            onClick={exportToExcel}
            disabled={filteredApplications.length === 0}
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
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default NamunaApplications;
