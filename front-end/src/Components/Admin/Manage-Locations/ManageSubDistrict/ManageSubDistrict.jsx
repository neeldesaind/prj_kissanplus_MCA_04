import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component"; // Importing DataTable

export default function AddSubDistrict() {
  const [subDistrictName, setSubDistrictName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Fetch states
  useEffect(() => {
    axios.get(`${BASE_URL}/api/states`).then((response) => {
      setStates(response.data.states);
    });
  }, [BASE_URL]);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState) {
      axios
        .get(`${BASE_URL}/api/districts/state/${selectedState}`)
        .then((response) => {
          setDistricts(response.data.districts);
        });
    }
  }, [selectedState,BASE_URL]);

  // Fetch sub-districts function
  const fetchSubDistricts = useCallback(() => {
    if (selectedDistrict) {
      axios
        .get(
          `${BASE_URL}/api/subdistricts/district/${selectedDistrict}?page=${page}`
        )
        .then((response) => {
          setSubDistricts(response.data.subdistricts);
          setTotalPages(response.data.totalPages || 1);
        })
        .catch((error) => {
          console.error("Error fetching sub-districts:", error);
        });
    }
  }, [selectedDistrict, page,BASE_URL]);

  // Fetch sub-districts when selectedDistrict or page changes
  useEffect(() => {
    fetchSubDistricts();
  }, [fetchSubDistricts]);

  // Handle filtering of sub-districts based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = subDistricts.filter((sub) =>
        sub.subdistrict_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubDistricts(filtered);
    } else {
      setFilteredSubDistricts(subDistricts);
    }
  }, [searchQuery, subDistricts]);

  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleAddSubDistrict = async (e) => {
    e.preventDefault();
    if (!subDistrictName || !selectedDistrict) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/subdistricts`, {
        subdistrict_name: capitalizeFirstLetter(subDistrictName), // Capitalizing here
        district_id: selectedDistrict,
      });

      toast.success("Sub-District added successfully!");
      setSubDistrictName(""); // Clear input after adding
      setPage(1);
      fetchSubDistricts();
    } catch (error) {
      console.error("Error adding sub-district:", error.response?.data);
      toast.error(error.response?.data?.message || "Error adding sub-district");
    }
  };

  const handleEditClick = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleUpdateSubDistrict = async (id) => {
    if (!editingName.trim()) {
      toast.error("Sub-District name cannot be empty");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/subdistricts/${id}`, {
        subdistrict_name: capitalizeFirstLetter(editingName), // Capitalizing here
        district_id: selectedDistrict,
      });

      toast.success("Sub-District updated successfully!");
      setEditingId(null);
      setEditingName("");
      fetchSubDistricts();
    } catch (error) {
      console.error("Error updating sub-district:", error);
      toast.error(error.response?.data?.message || "Error updating sub-district");
    }
  };

  // Columns configuration for DataTable
  const columns = [
    {
      name: "ID",
      selector: (row) => row.subdistrict_id,
      sortable: true,
      width: "10%",
    },
    {
      name: "Sub-District Name",
      selector: (row) =>
        editingId === row._id ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          />
        ) : (
          row.subdistrict_name
        ),
      sortable: true,
      width: "70%",
    },
    {
      name: "Actions",
      cell: (row) =>
        editingId === row._id ? (
          <button
            onClick={() => handleUpdateSubDistrict(row._id)}
            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => handleEditClick(row._id, row.subdistrict_name)}
            className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 text-sm"
          >
            Edit
          </button>
        ),
      width: "20%",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-10">
      <h2 className="text-xl font-bold mb-6 text-center ">Manage Sub-District</h2>
      <form onSubmit={handleAddSubDistrict} className="space-y-4">
        <label className="block text-sm font-medium">Select State</label>
        <select
          className="w-full p-3 border rounded text-sm"
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

        <label className="block text-sm font-medium">Select District</label>
        <select
          className="w-full p-3 border rounded text-sm"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          required
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district._id} value={district._id}>
              {district.district_name}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium">Sub-District Name</label>
        <input
          className="w-full p-3 border rounded text-sm"
          type="text"
          value={subDistrictName}
          onChange={(e) => setSubDistrictName(e.target.value)}
          placeholder="Enter Sub-District Name"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 text-sm"
        >
          Add Sub-District
        </button>
      </form>

      {/* Search input will appear only if a district is selected */}
      {selectedDistrict && (
        <div className="mt-6">
          <label className="block text-sm font-medium">Search Sub-Districts</label>
          <input
            className="w-full p-3 border rounded text-sm"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Sub-District name"
          />
        </div>
      )}

      {/* DataTable for displaying sub-districts */}
      {selectedState && selectedDistrict && filteredSubDistricts.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <DataTable
            columns={columns}
            data={filteredSubDistricts}
            pagination
            paginationServer
            paginationTotalRows={totalPages * 10} // Assuming 10 items per page
            onChangePage={(page) => setPage(page)} // Handle page change
            highlightOnHover
            pointerOnHover
          />
        </div>
      )}
    </div>
  );
}
