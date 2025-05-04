import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component"; // Importing DataTable
import { useDarkMode } from "../../../Context/useDarkMode"; // Importing useDarkMode for theme management

export default function AddVillage() {
  const [villageName, setVillageName] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [editingVillage, setEditingVillage] = useState(null); // Store the village currently being edited
  const [editedVillageName, setEditedVillageName] = useState(""); // Store the new name for editing
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
  const [villagesFetched, setVillagesFetched] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
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


  // Loading state
  const [loading, setLoading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/states`)
      .then((res) => {
        // Ensure res.data.states is an array
        setStates(res.data.states || []);  // If res.data.states is not an array, fall back to an empty array
      })
      .catch(() => toast.error("Error fetching states"))
      .finally(() => setLoading(false)); // Set loading to false when request finishes
  }, [BASE_URL]);
  

  useEffect(() => {
    if (!selectedState) return;
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/districts/state/${selectedState}`)
      .then((res) => {
        setDistricts(res.data.districts || []);
        setSelectedDistrict("");
        setSubDistricts([]);
      })
      .catch(() => toast.error("Error fetching districts"))
      .finally(() => setLoading(false)); // Set loading to false when request finishes
  }, [selectedState]);

  useEffect(() => {
    if (!selectedDistrict) return;
    setLoading(true);
    axios
      .get(
        `http://localhost:3000/api/subdistricts/district/${selectedDistrict}`
      )
      .then((res) => {
        setSubDistricts(res.data.subdistricts || []);
        setSelectedSubDistrict("");
      })
      .catch(() => toast.error("Error fetching sub-districts"))
      .finally(() => setLoading(false)); // Set loading to false when request finishes
  }, [selectedDistrict]);

  const fetchVillages = useCallback(() => {
    if (!selectedSubDistrict) return;
    setLoading(true);
    setVillagesFetched(false); // Reset the fetched flag before fetching

    axios
      .get(
        `http://localhost:3000/api/villages/subdistrict/${selectedSubDistrict}`
      )
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setVillages(res.data.length > 0 ? res.data : []);
        } else {
          setVillages([]);
        }
      })
      .catch((error) => {
        if (error.response?.status !== 404) {
          toast.error("Error fetching villages.");
        }
      })
      .finally(() => {
        setLoading(false); // Set loading to false when request finishes
        setVillagesFetched(true); // Mark the villages as fetched
      });
  }, [selectedSubDistrict]);

  useEffect(() => {
    if (selectedSubDistrict) {
      fetchVillages();
    }
  }, [selectedSubDistrict, fetchVillages]);

  const handleAddVillage = async (e) => {
    e.preventDefault();

    if (
      !villageName ||
      !selectedState ||
      !selectedDistrict ||
      !selectedSubDistrict
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    const villageExists = villages.some(
      (village) =>
        village.village_name.toLowerCase() === villageName.toLowerCase()
    );
    if (villageExists) {
      toast.error("Village name already exists!");
      return;
    }

    setLoading(true); // Start loading when the request is made

    try {
      await axios.post("http://localhost:3000/api/villages", {
        village_name: villageName,
        subdistrict_id: selectedSubDistrict,
      });

      toast.success("Village added successfully!");
      setVillageName("");
      fetchVillages();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add village. Try again!";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Stop loading when the request is finished
    }
  };

  const handleEditVillage = (village) => {
    setEditingVillage(village._id);
    setEditedVillageName(village.village_name); // Set the current village name for editing
  };

  const handleSaveVillage = async (villageId) => {
    toast.dismiss();
    if (!editedVillageName.trim()) {
      toast.error("Village name cannot be empty!");
      return;
    }

    // Optional: Validate if the village name is unique before submitting
    const villageExists = villages.some(
      (village) =>
        village.village_name.toLowerCase() ===
          editedVillageName.toLowerCase() && village._id !== villageId
    );
    if (villageExists) {
      toast.error("Village name already exists!");
      return;
    }

    setLoading(true); // Start loading when the request is made

    try {
      // Send PUT request to update the village
      await axios.put(`http://localhost:3000/api/villages/${villageId}`, {
        village_name: editedVillageName,
      });

      toast.success("Village updated successfully!");
      setEditingVillage(null); // Reset editing state to stop editing mode
      fetchVillages(); // Fetch the updated village list
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update village. Try again!";
      toast.error(errorMessage); // Show error message from the server
    } finally {
      setLoading(false); // Stop loading when the request is finished
    }
  };

  // Columns configuration for DataTable
  const columns = [
    {
      name: "ID",
      selector: (row) => row.village_id,
      sortable: true,
      width: "10%",
    },
    {
      name: "Village Name",
      selector: (row) =>
        editingVillage === row._id ? (
          <input
            className="p-2 border rounded w-full"
            type="text"
            value={editedVillageName}
            onChange={(e) => setEditedVillageName(e.target.value)}
          />
        ) : (
          row.village_name
        ),
      sortable: true,
      width: "70%",
    },
    {
      name: "Actions",
      cell: (row) =>
        editingVillage === row._id ? (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => handleSaveVillage(row._id)}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            onClick={() => handleEditVillage(row)}
          >
            Edit
          </button>
        ),
      width: "20%",
    },
  ];

  // Filter villages based on the search query
  const filteredVillages = villages.filter((village) =>
    village.village_name.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-10 dark:bg-black dark:text-gray-100">
      <h2 className="text-xl font-bold mb-6 text-center dark:bg-black dark:text-gray-100">Manage Village</h2>
      <form onSubmit={handleAddVillage} className="space-y-4 dark:bg-black dark:text-gray-100">
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

        <label className="block font-medium text-sm dark:bg-black dark:text-gray-100">Village Name</label>
        <input
          className="w-full p-3 border rounded text-sm dark:bg-black dark:text-gray-100"
          type="text"
          value={villageName}
          onChange={(e) => setVillageName(e.target.value)}
          placeholder="Enter Village Name"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded text-sm hover:bg-green-600"
        >
          Add Village
        </button>
      </form>

      {/* Search villages section after Add Village button */}
      {selectedSubDistrict && (
        <div className="mt-4">
          <label className="block font-medium text-sm">Search Villages</label>
          <input
            className="w-full p-3 border rounded text-sm"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by village name"
          />
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 text-sm">Loading...</p>
      ) : selectedState && selectedDistrict && selectedSubDistrict ? (
        villagesFetched ? (
          filteredVillages.length > 0 ? (
            <div className="mt-6">
              <DataTable
                columns={columns}
                data={filteredVillages}
                pagination
                customStyles={customStyles}
                noDataComponent={<NoDataComponent />}
                pointerOnHover
              />
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-500 text-sm">
              No villages found.
            </p>
          )
        ) : null
      ) : null}
    </div>
  );
}
