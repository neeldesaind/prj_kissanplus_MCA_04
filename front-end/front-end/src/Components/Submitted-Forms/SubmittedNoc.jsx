import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Lottie from 'lottie-react';
import loadingAnime from '../../assets/lottie/loadingAnime.json';
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useDarkMode } from "../Context/useDarkMode";


function SubmittedNoc() {
  const [nocs, setNocs] = useState([]);
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
  pagination: {
    style: {
      backgroundColor: isDarkMode ? "#1b1c1c" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    },
  },
};



  useEffect(() => {
    const fetchNocForms = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) throw new Error("User ID is missing.");

        const profileResponse = await fetch(
          `${BASE_URL}/api/users/profile/${storedUserId}`
        );
        if (!profileResponse.ok) throw new Error("Failed to fetch profile.");
        const profileData = await profileResponse.json();
        const userId = profileData.user_id;
        if (!userId) throw new Error("User ID is missing in profile data.");

        const nocResponse = await fetch(`${BASE_URL}/api/noc/user/${userId}`);
        if (!nocResponse.ok) {
          if (nocResponse.status === 404) {
            setNocs([]);
            return;
          }
          throw new Error("An unexpected error occurred while fetching NOCs.");
        }

        const nocData = await nocResponse.json();

        if (nocData.length === 0) {
          setNocs([]);
          return;
        }

        const formatted = nocData.map((noc) => {
          const farm = noc.farm_ids?.[0] || {};
          const surveyNumber = farm.surveyNumber || "-";
          const poatNumber = farm.poatNumber || "-";
          const submitDate = new Date(noc.createdAt).toLocaleDateString();

          const approvalDate =
            noc.isApprovedbyTalati && noc.isApprovedbyTalatiAt
              ? new Date(noc.isApprovedbyTalatiAt).toLocaleDateString()
              : "-";

          const denialDate =
            noc.isDeniedbyTalati && noc.isDeniedByTalatiAt
              ? new Date(noc.isDeniedByTalatiAt).toLocaleDateString()
              : "-";

          let status = "Pending";
          if (noc.isApprovedbyTalati) {
            status = "Approved";
          } else if (noc.isDeniedbyTalati) {
            status = "Denied";
          }

          return {
            id: noc._id,
            nocId: noc.noc_id,
            reasonForNoc: noc.reason_for_noc || "N/A",
            surveyNumber,
            poatNumber,
            submitDate,
            approvedDate: approvalDate,
            deniedDate: denialDate,
            status,
          };
        });

        setNocs(formatted);
      } catch (error) {
        console.error("Failed to fetch NOCs", error);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNocForms();
  }, []);

  const columns = [
    {
      name: "NOC ID",
      selector: (row) => row.nocId,
      sortable: true,
      wrap: true,
    },
    { name: "Reason for NOC", selector: (row) => row.reasonForNoc },
    { name: "Survey Number", selector: (row) => row.surveyNumber },
    { name: "Poat Number", selector: (row) => row.poatNumber },
    { name: "Submit Date", selector: (row) => row.submitDate, sortable: true },
    { name: "Approved Date", selector: (row) => row.approvedDate },
    { name: "Denied Date", selector: (row) => row.deniedDate },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        let statusColor = "";
        if (row.status === "Approved") statusColor = "text-green-500";
        if (row.status === "Denied") statusColor = "text-red-500";
        if (row.status === "Pending") statusColor = "text-orange-500";

        return (
          <span className={`font-semibold ${statusColor}`}>{row.status}</span>
        );
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
    <div className="p-4 mt-5 dark:bg-black dark:text-white">
      {loading ? (
          <Lottie animationData={loadingAnime} className="w-40 h-40" />
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : nocs.length === 0 ? (
        <div className="text-black dark:bg-back dark:text-white">No NOC applications found.</div>
      ) : (
        <DataTable
          columns={columns}
          data={nocs}
          pagination
          responsive
          customStyles={customStyles}
          noDataComponent={<NoDataComponent />}
        />
      )}
    </div>
  );
}

export default SubmittedNoc;
