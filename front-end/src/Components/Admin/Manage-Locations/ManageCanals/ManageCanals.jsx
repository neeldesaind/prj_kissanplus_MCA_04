import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
import { useDarkMode } from "../../../Context/useDarkMode";

export default function AddCanal() {
  const [canalName, setCanalName] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [canals, setCanals] = useState([]);
  const [editingCanal, setEditingCanal] = useState(null);
  const [editedCanalName, setEditedCanalName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [loading, setLoading] = useState({
    general: false,
    canals: false,
    villages: false,
  });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCanals, setTotalCanals] = useState(0);
  const itemsPerPage = 5; // Items per page for pagination
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


  // Fetch States
  useEffect(() => {
    setLoading((prev) => ({ ...prev, general: true }));
    axios
      .get(`${BASE_URL}/api/states`)
      .then((res) => {
        setStates(res.data.states || []);
      })
      .catch(() => toast.error("Error fetching states"))
      .finally(() => setLoading((prev) => ({ ...prev, general: false })));
  }, [BASE_URL]);

  // Fetch Districts
  useEffect(() => {
    if (!selectedState) return;
    setLoading((prev) => ({ ...prev, general: true }));
    axios
      .get(`${BASE_URL}/api/districts/state/${selectedState}`)
      .then((res) => {
        setDistricts(res.data.districts || []);
        setSelectedDistrict("");
        setSubDistricts([]);
      })
      .catch(() => toast.error("Error fetching districts"))
      .finally(() => setLoading((prev) => ({ ...prev, general: false })));
  }, [selectedState, BASE_URL]);

  // Fetch Sub-Districts
  useEffect(() => {
    if (!selectedDistrict) return;
    setLoading((prev) => ({ ...prev, general: true }));
    axios
      .get(
        `${BASE_URL}/api/subdistricts/district/${selectedDistrict}`
      )
      .then((res) => {
        setSubDistricts(res.data.subdistricts || []);
        setSelectedSubDistrict("");
      })
      .catch(() => toast.error("Error fetching sub-districts"))
      .finally(() => setLoading((prev) => ({ ...prev, general: false })));
  }, [selectedDistrict, BASE_URL]);

  // Fetch Villages
  useEffect(() => {
    if (!selectedSubDistrict) {
      setVillages([]);
      return;
    }

    setLoading((prev) => ({ ...prev, villages: true }));
    axios
      .get(
        `${BASE_URL}/api/villages/subdistrict/${selectedSubDistrict}`
      )
      .then((res) => {
        setVillages(res.data || []);
        setSelectedVillage(""); // Reset village on sub-district change
      })
      .catch(() => toast.error("Error fetching villages"))
      .finally(() => setLoading((prev) => ({ ...prev, villages: false })));
  }, [selectedSubDistrict, BASE_URL]);

  // Fetch Canals with Pagination
  const fetchCanals = useCallback(() => {
    if (!selectedVillage) return; // Ensure selectedVillage exists

    setLoading((prev) => ({ ...prev, canals: true }));

    axios
      .get(
        `${BASE_URL}/api/canals/village/${selectedVillage}?page=${currentPage}&limit=${itemsPerPage}`
      )
      .then((res) => {
        if (res.data && Array.isArray(res.data.canals)) {
          setCanals(res.data.canals);
          setTotalCanals(res.data.totalCanals); // Set total canals for pagination
        } else {
          setCanals([]);
        }
      })
      .catch(() => toast.error("Error fetching canals"))
      .finally(() => setLoading((prev) => ({ ...prev, canals: false })));
  }, [selectedVillage, currentPage, BASE_URL]);

  useEffect(() => {
    fetchCanals(); // Fetch canals whenever currentPage changes
  }, [currentPage, fetchCanals]);

  // Handle Add Canal
  const handleAddCanal = async (e) => {
    e.preventDefault();
    if (
      !canalName ||
      !selectedState ||
      !selectedDistrict ||
      !selectedSubDistrict ||
      !selectedVillage
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    const canalExists = canals.some(
      (canal) => canal.canal_name.toLowerCase() === canalName.toLowerCase()
    );
    if (canalExists) {
      toast.error("Canal name already exists!");
      return;
    }

    setLoading((prev) => ({ ...prev, general: true }));
    try {
      await axios.post(`${BASE_URL}/api/canals/add`, {
        canal_name: canalName,
        subdistrict_id: selectedSubDistrict,
        village_id: selectedVillage,
      });

      toast.success("Canal added successfully!");
      setCanalName("");
      fetchCanals(); // Re-fetch canals
    } catch (error) {
      toast.error("Failed to add canal. Try again!", error);
    } finally {
      setLoading((prev) => ({ ...prev, general: false }));
    }
  };

  // Handle Edit Canal
  const handleEditCanal = (canal) => {
    setEditingCanal(canal._id); // Set the canal to edit
    setEditedCanalName(canal.canal_name); // Set current canal name for editing
  };

  const handleSaveCanal = async (canalId) => {
    // Check if the canal name already exists in the list (optional validation)
    const canalExists = canals.some(
      (canal) =>
        canal.canal_name.toLowerCase() === editedCanalName.toLowerCase() &&
        canal._id !== canalId
    );
    if (canalExists) {
      toast.error("Canal name already exists!");
      return;
    }

    setLoading(true); // Start loading when the request is made

    try {
      // Send PUT request to update the canal
      await axios.put(`${BASE_URL}/api/canals/${canalId}`, {
        canal_name: editedCanalName,
      });

      toast.success("Canal updated successfully!");
      setEditingCanal(null); // Reset editing state to stop editing mode
      fetchCanals(); // Fetch the updated canal list
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update canal. Try again!";
      toast.error(errorMessage); // Show error message from the server
    } finally {
      setLoading(false); // Stop loading when the request is finished
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages()) return;
    setCurrentPage(page); // Update currentPage for pagination
  };

  // Calculate total pages
  const totalPages = () => {
    return Math.ceil(totalCanals / itemsPerPage);
  };

  // DataTable Columns
  const columns = [
    {
      name: "Canal ID",
      selector: (row) => row.canal_id, // Assuming canal_id is the correct field
      sortable: true,
      cell: (row) => row.canal_id, // Display the canal_id
    },
    {
      name: "Canal Name",
      selector: (row) => row.canal_name,
      sortable: true,
      cell: (row) => (
        <div>
          {editingCanal === row._id ? (
            <input
              type="text"
              value={editedCanalName}
              onChange={(e) => setEditedCanalName(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
          ) : (
            row.canal_name
          )}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          {editingCanal === row._id ? (
            <button
              onClick={() => handleSaveCanal(row._id)}
              className="bg-blue-500 text-white p-2 rounded text-sm"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => handleEditCanal(row)}
              className="bg-yellow-500 text-white p-2 rounded text-sm"
            >
              Edit
            </button>
          )}
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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-10 text-black dark:bg-black dark:text-gray-100">
      <h2 className="font-bold mb-6 text-center text-xl dark:bg-black dark:text-gray-100">Manage Canal</h2>
      <form onSubmit={handleAddCanal} className="space-y-4 dark:bg-black dark:text-gray-100">
        {/* Select State */}
        <label className="block font-medium text-sm dark:bg-black dark:text-gray-100">Select State</label>
        <select
          className="w-full p-3 border rounded text-sm dark:bg-black dark:text-gray-100"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          required
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state._id} value={state._id}>
              {state.state_name}
            </option>
          ))}
        </select>

        {/* Select District */}
        <label className="block font-medium text-sm dark:bg-black dark:text-gray-100">Select District</label>
        <select
          className="w-full p-3 border rounded text-sm dark:bg-black dark:text-gray-100"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          required
          disabled={!selectedState}
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district._id} value={district._id}>
              {district.district_name}
            </option>
          ))}
        </select>

        {/* Select Sub-District */}
        <label className="block font-medium text-sm dark:bg-black dark:text-gray-100">Select Sub-District</label>
        <select
          className="w-full p-3 border rounded text-sm dark:bg-black dark:text-gray-100"
          value={selectedSubDistrict}
          onChange={(e) => setSelectedSubDistrict(e.target.value)}
          required
          disabled={!selectedDistrict}
        >
          <option value="">Select Sub-District</option>
          {subDistricts.map((subDistrict) => (
            <option key={subDistrict._id} value={subDistrict._id}>
              {subDistrict.subdistrict_name}
            </option>
          ))}
        </select>

        {/* Select Village */}
        <label className="block font-medium text-sm dark:bg-black dark:text-gray-100">Select Village</label>
        <select
          className="w-full p-3 border rounded text-sm dark:bg-black dark:text-gray-100"
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
          required
          disabled={!selectedSubDistrict}
        >
          <option value="">Select Village</option>
          {loading.villages ? (
            <option>Loading villages...</option>
          ) : villages.length > 0 ? (
            villages.map((village) => (
              <option key={village._id} value={village._id}>
                {village.village_name}
              </option>
            ))
          ) : (
            <option>No villages available</option>
          )}
        </select>

        {/* Canal Name */}
        <label className="block font-medium text-sm dark:bg-black dark:text-gray-100">Canal Name</label>
        <input
          type="text"
          value={canalName}
          onChange={(e) => setCanalName(e.target.value)}
          className="w-full p-3 border rounded text-sm dark:bg-black dark:text-gray-100"
          placeholder="Enter canal name"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded text-sm"
          disabled={loading.general}
        >
          {loading.general ? "Adding Canal..." : "Add Canal"}
        </button>
      </form>

      {/* Canal List - Display only when a village is selected */}
      {selectedVillage && canals.length > 0 && (
        <div className="mt-10">
          <h3 className="font-semibold mb-4 text-sm dark:bg-black dark:text-gray-100">Canals List</h3>
          <DataTable
            columns={columns}
            data={canals}
            pagination
            paginationServer
            paginationTotalRows={totalCanals}
            onChangePage={handlePageChange}
            persistTableHead
            customStyles={customStyles}
            noDataComponent={<NoDataComponent />}
          />
        </div>
      )}
    </div>
  );
}
