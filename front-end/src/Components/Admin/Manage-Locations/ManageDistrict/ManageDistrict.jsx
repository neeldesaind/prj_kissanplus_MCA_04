import { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import DataTable from "react-data-table-component";

export default function AddDistrict() {
  const [districtName, setDistrictName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/states`);
        setStates(response.data.states);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, [BASE_URL]);

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedState) {
        setDistricts([]);
        setFilteredDistricts([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/districts/state/${selectedState}`
        );
        setDistricts(response.data.districts);
        setFilteredDistricts(response.data.districts);
      } catch (error) {
        console.error("Error fetching districts:", error);
        setDistricts([]);
        setFilteredDistricts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [selectedState,BASE_URL]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDistricts(districts);
    } else {
      setFilteredDistricts(
        districts.filter((district) =>
          district.district_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, districts]);

  // Manage district
  const handleAddDistrict = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!districtName || !selectedState) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/districts`, {
        district_name: districtName.trim(),
        state_id: selectedState,
      });

      toast.success("District added successfully!");
      setDistrictName("");

      // Refresh districts
      const response = await axios.get(
        `${BASE_URL}/api/districts/state/${selectedState}`
      );
      setDistricts(response.data.districts);
      setFilteredDistricts(response.data.districts);
    } catch (error) {
      console.error("Error adding district:", error);
      toast.error(error.response?.data?.message || "Error adding district");
    }
  };

  // Start editing a district
  const handleEditDistrict = (district) => {
    setEditingDistrict({ ...district });
  };

  // Save updated district
  const handleUpdateDistrict = async () => {
    toast.dismiss();
    if (!editingDistrict?.district_name.trim()) {
      toast.error("District name cannot be empty!");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/districts/${editingDistrict._id}`,
        {
          district_name: editingDistrict.district_name.trim(),
          state_id: selectedState,
        }
      );

      toast.success("District updated successfully!");
      setEditingDistrict(null);

      // Refresh districts
      const res = await axios.get(
        `${BASE_URL}/api/districts/state/${selectedState}`
      );
      setDistricts(res.data.districts);
      setFilteredDistricts(res.data.districts);
    } catch (error) {
      console.error("Error updating district:", error);
      toast.error(error.response?.data?.message || "Error updating district");
    }
  };

  // Table columns
  const columns = [
    { name: "District ID", selector: (row) => row.district_id, sortable: true },
    {
      name: "District Name",
      selector: (row) =>
        editingDistrict && editingDistrict.district_id === row.district_id ? (
          <input
            type="text"
            className="w-full p-2 border rounded text-sm"
            value={editingDistrict.district_name}
            onChange={(e) =>
              setEditingDistrict({
                ...editingDistrict,
                district_name: e.target.value,
              })
            }
          />
        ) : (
          row.district_name
        ),
      grow: 2,
    },
    {
      name: "Actions",
      cell: (row) =>
        editingDistrict && editingDistrict.district_id === row.district_id ? (
          <button
            onClick={handleUpdateDistrict}
            className="bg-blue-500 text-white px-3 py-2 rounded mr-2 hover:bg-blue-600 text-sm"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => handleEditDistrict(row)}
            className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 text-sm"
          >
            Edit
          </button>
        ),
      button: true,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-10 ">
      <h2 className="text-xl font-bold mb-6 text-center">Manage District</h2>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Add District Form */}
      <form onSubmit={handleAddDistrict} className="space-y-4">
        <label className="block font-medium text-sm">Select State</label>
        <select
          className="w-full p-3 border rounded text-sm"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          required
        >
          <option value="">Select State</option>
          {states.length > 0 ? (
            states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.state_name}
              </option>
            ))
          ) : (
            <option disabled>Loading states...</option>
          )}
        </select>

        <label className="block font-medium text-sm">District Name</label>
        <input
          className="w-full p-3 border rounded text-sm"
          type="text"
          value={districtName}
          onChange={(e) => setDistrictName(e.target.value)}
          placeholder="Enter District Name"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 text-sm"
        >
          Add District
        </button>
      </form>

      {/* Show search only when a state is selected, after the Add District button */}
      {selectedState && (
        <input
          type="text"
          className="w-full p-3 border rounded mt-4 text-sm"
          placeholder="Search districts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}

      {/* DataTable for Districts */}
      {selectedState && (
        <div className="mt-6">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading districts...</p>
          ) : (
            <DataTable
              columns={columns}
              data={filteredDistricts}
              pagination
            />
          )}
        </div>
      )}
    </div>
  );
}
