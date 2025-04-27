import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ReactDataTable from "react-data-table-component";
import { useNavigate } from "react-router"; // ✅ for navigation
import Lottie from "lottie-react";
import loadingAnime from "../../../assets/lottie/loadingAnime.json";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ApproveDenyForm12 = () => {
  const [form12s, setForm12s] = useState([]);
  const [filteredForm12s, setFilteredForm12s] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // ✅

  const fetchForm12s = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/form12/all`);
      setForm12s(res.data);
      setFilteredForm12s(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching form12s:", error);
      toast.error("Failed to load form12 applications.");
    }
  };

  useEffect(() => {
    fetchForm12s();
  }, []);

  useEffect(() => {
    const filtered = form12s.filter((row) => {
      const farmerName = row.farmerName ? row.farmerName.toLowerCase() : "";
      return farmerName.includes(search.toLowerCase());
    });
    setFilteredForm12s(filtered);
  }, [search, form12s]);

  const getStatus = (row) => {
    if (row.isApprovedByEngineer) {
      return <span className="text-green-600 font-semibold">Approved</span>;
    } else if (row.isDeniedByEngineer) {
      return <span className="text-red-600 font-semibold">Denied</span>;
    } else {
      return <span className="text-orange-500 font-semibold">Pending</span>;
    }
  };

  const columns = [
    { name: "Farmer Name", selector: (row) => row.farmerName, sortable: true },
    { name: "Status", cell: (row) => getStatus(row) },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => navigate(`/side-bar/view/${row.form12RefId}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
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
    <div className="max-w-6xl mx-auto mt-6 mb-10 ml-70">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Approve/Deny Rates</h1>
        </div>

        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
          placeholder="Search by Farmer Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ReactDataTable
          columns={columns}
          data={filteredForm12s}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default ApproveDenyForm12;
