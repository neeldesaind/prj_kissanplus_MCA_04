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

const ExemptionApplications = () => {
  const [exemptions, setExemptions] = useState([]);
  const [filteredExemptions, setFilteredExemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExemptions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/exemptions/all`);
        setExemptions(res.data);
        setFilteredExemptions(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exemptions:", error);
        toast.error("Failed to load exemptions.");
      }
    };

    fetchExemptions();
  }, []);

  useEffect(() => {
    const filtered = exemptions.filter((row) => {
      const user = row.profile_id?.user_id;
      if (user) {
        const fullName = `${user.firstName} ${user.middleName || ""} ${user.lastName || ""}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
      }
      return false;
    });

    setFilteredExemptions(filtered);
  }, [search, exemptions]);

  const getStatus = (row) => {
    if (row.isApprovedbyTalati) {
      return <span className="text-green-600 font-semibold">Approved</span>;
    } else if (row.isDeniedbyTalati) {
      return <span className="text-red-600 font-semibold">Denied</span>;
    } else {
      return <span className="text-orange-500 font-semibold">Pending</span>;
    }
  };

  const exportToExcel = () => {
    const exportData = filteredExemptions.map((row) => {
      const user = row.profile_id?.user_id;
      const fullName = user
        ? `${user.firstName || ""} ${user.middleName || ""} ${user.lastName || ""}`.trim()
        : "Unknown";

      return {
        "Exemption ID": row.exemption_id,
        "Farmer Name": fullName,
        Status: row.isApprovedbyTalati
          ? "Approved"
          : row.isDenied
          ? "Denied"
          : "Pending",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exemption Applications");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "exemption_applications.xlsx");
  };

  const columns = [
    { name: "Exemption ID", selector: row => row.exemption_id, sortable: true },
    {
      name: "Farmer Name",
      selector: row => {
        const user = row.profile_id?.user_id;
        return user ? `${user.firstName} ${user.middleName || ""} ${user.lastName || ""}`.trim() : "Unknown";
      },
    },
    {
      name: "Status",
      cell: row => getStatus(row),
    },
    {
      name: "Actions",
      cell: row => (
        <button
          onClick={() => navigate(`/side-bar/view-exemption/${row.exemption_id}`)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
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

  

  return (
    <div className="max-w-5xl mx-auto mt-6 mb-10 ml-80">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Exemption Applications</h1>
          <button
            className={`${
              filteredExemptions.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 rounded`}
            onClick={exportToExcel}
            disabled={filteredExemptions.length === 0} // Disable if no data
          >
            Export to Excel
          </button>
        </div>

        <input
          type="text"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Search by Farmer Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ReactDataTable
          columns={columns}
          data={filteredExemptions}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default ExemptionApplications;
