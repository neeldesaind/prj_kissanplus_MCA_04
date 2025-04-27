import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import DataTable from "react-data-table-component";

export default function ManageStates() {
  const [stateName, setStateName] = useState("");
  const [states, setStates] = useState([]);
  const [editingState, setEditingState] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch states with pagination
  const fetchStates = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/states?page=${page}&limit=10`);
      const data = await response.json();
      if (response.ok) {
        setStates(data.states);
        setTotalPages(data.totalPages);
      } else {
        toast.error(data.message || "Failed to load states!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Request failed:", error);
    }
  }, [page,BASE_URL]);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  // Format state name (capitalize each word)
  const formatStateName = (name) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Manage state
  const handleAddState = async (e) => {
    toast.dismiss();
    e.preventDefault();
    if (stateName) {
      const formattedStateName = formatStateName(stateName);
      try {
        const response = await fetch(`${BASE_URL}/api/states/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state_name: formattedStateName }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("State added successfully!");
          setStateName("");
          fetchStates(); // Refresh list
        } else {
          toast.error(data.message || "Failed to add state!");
        }
      } catch (error) {
        toast.error("Something went wrong!");
        console.error("Request failed:", error);
      }
    }
  };

  // Update state
  const handleUpdateState = async () => {
    toast.dismiss();
    if (!editingState) return;

    try {
      const response = await fetch(`${BASE_URL}/api/states/${editingState.state_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state_name: editingState.state_name }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("State updated successfully!");
        setEditingState(null);
        fetchStates();
      } else if (data.message === "State already exists") {
        toast.error("This state name already exists. Choose a different name!");
      } else {
        toast.error(data.message || "Failed to update state!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Request failed:", error);
    }
  };

  // Filter states based on search query
  const filteredStates = states.filter((state) =>
    state.state_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-10 text-sm">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-xl font-bold mb-6 text-center">Manage States</h2>

      {/* Add State Form */}
      <form onSubmit={handleAddState} className="space-y-4 mb-6">
        <label className="block font-medium">State Name</label>
        <input
          className="w-full p-3 border rounded"
          type="text"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          placeholder="Enter State Name"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 text-sm">
          Add State
        </button>
      </form>

      {/* Search Input */}
      <input
        type="text"
        className="w-full p-3 border rounded mb-4 text-sm"
        placeholder="Search states..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* State List Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={[
            { name: "ID", selector: (row) => row.state_id, sortable: true },
            {
              name: "State Name",
              selector: (row) =>
                editingState && editingState.state_id === row.state_id ? (
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-sm"
                    value={editingState.state_name}
                    onChange={(e) =>
                      setEditingState({ ...editingState, state_name: e.target.value })
                    }
                  />
                ) : (
                  row.state_name
                ),
              sortable: true,
            },
            {
              name: "Actions",
              cell: (row) =>
                editingState && editingState.state_id === row.state_id ? (
                  <button
                    onClick={handleUpdateState}
                    className="bg-blue-500 text-white px-3 py-2 rounded mr-2 hover:bg-blue-600 text-sm"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingState(row)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                ),
            },
          ]}
          data={filteredStates}
          pagination
        />
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded mx-1 disabled:opacity-50 text-sm"
        >
          Prev
        </button>
        <span className="px-4 py-2 text-sm">{`Page ${page} of ${totalPages}`}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded mx-1 disabled:opacity-50 text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
