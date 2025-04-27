import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Lottie from 'lottie-react';
import loadingAnime from '../../assets/lottie/loadingAnime.json';
import { useDarkMode } from "../Context/useDarkMode";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function SubmittedNamuna7() {
  const [namuna7s, setNamuna7s] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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
  striped: {
    style: {
      backgroundColor: isDarkMode ? "#232323" : "#f9f9f9",
    },
  },
  pagination: {
    style: {
      backgroundColor: isDarkMode ? "#1b1c1c" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    },
  },
  tableWrapper: {
    style: {
      overflowX: "auto", // enable horizontal scroll if needed
    },
  },
};


  useEffect(() => {
    const fetchNamuna7Forms = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) throw new Error("User ID is missing.");

        const profileResponse = await fetch(`${BASE_URL}/api/users/profile/${storedUserId}`);
        if (!profileResponse.ok) throw new Error("Failed to fetch profile.");
        const profileData = await profileResponse.json();

        const profileId = profileData._id;
        if (!profileId) throw new Error("Profile ID is missing in profile data.");

        const namuna7Response = await fetch(`${BASE_URL}/api/namuna7/profile/${profileId}`);
        if (!namuna7Response.ok)
          throw new Error(``);
        const namuna7Data = await namuna7Response.json();

        const formatted = namuna7Data.map((namuna) => {
          const farm = namuna.farmDetails?.[0] || {};
          const farmInfo = farm.farm_id || {};
          const canalInfo = farm.canal_id || {};

          return {
            id: namuna._id,
            namunaId: namuna.namuna_id,
            reasonForWater: namuna.source_type || "N/A",
            surveyNumber: farmInfo.surveyNumber || "-",
            poatNumber: farmInfo.poatNumber || "-",
            farmArea: farmInfo.farmArea || "-",
            canalName: canalInfo.canal_name || "-",
            submitDate: new Date(namuna.createdAt).toLocaleDateString(),
            approvedDate: namuna.isApprovedbyTalati
              ? new Date(namuna.updatedAt).toLocaleDateString()
              : "-",
            status: namuna.isApprovedbyTalati
              ? "Approved"
              : namuna.isDeniedbyTalati
              ? "Denied"
              : "Pending",
          };
        });

        setNamuna7s(formatted);
      } catch (error) {
        console.error("Failed to fetch Namuna7s", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNamuna7Forms();
  }, []);

  const columns = [
    { name: "Namuna 7 ID", selector: (row) => row.namunaId, sortable: true },
    { name: "Source Type", selector: (row) => row.reasonForWater, wrap: true },
    { name: "Survey Number", selector: (row) => row.surveyNumber },
    { name: "Poat Number", selector: (row) => row.poatNumber },
    { name: "Farm Area", selector: (row) => row.farmArea },
    { name: "Canal Name", selector: (row) => row.canalName },
    { name: "Submit Date", selector: (row) => row.submitDate, sortable: true },
    { name: "Approved Date", selector: (row) => row.approvedDate },
    {
      name: "Talati",
      selector: (row) => row.status,
      sortable: true,
      
      cell: (row) => {
        let statusColor = "";
        if (row.status === "Approved") statusColor = "text-green-500";
        if (row.status === "Denied") statusColor = "text-red-500";
        if (row.status === "Pending") statusColor = "text-orange-500";

        return <span className={`font-semibold ${statusColor}`}>{row.status}</span>;
      },
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
    <div className="p-2 flex justify-center mt-4">
      <div className="bg-white shadow-md rounded-md w-full max-w-5xl dark:bg-black dark:text-gray-100">
        {loading ? (
        <div className="flex justify-center items-center h-screen ">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
            <DataTable
            columns={columns}
            data={namuna7s}
            pagination
            noDataComponent={<NoDataComponent />}
            responsive
            customStyles={customStyles}
          />
        )}
      </div>
    </div>
  );
}

export default SubmittedNamuna7;
