import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-hot-toast";

const FarmDetails = () => {
  const [farms, setFarms] = useState([
    {
      state_id: "",
      district_id: "",
      subdistrict_id: "",
      village_id: "",
      surveyNumber: "",
      poatNumber: "",
      farmArea: "",
      districts: [],
      subDistricts: [],
      villages: [],
    },
  ]);

  const [states, setStates] = useState([]);
  const userId = localStorage.getItem("userId"); // or wherever you store the userId
  const userRole = localStorage.getItem("userRole");
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    // Fetch states from backend
    axios
      .get(`${BASE_URL}/api/states`)
      .then((res) => setStates(res.data.states || []))
      .catch(() => toast.error("Error fetching states"));

    // Fetch existing farm data from backend
    axios
      .get(
        `${BASE_URL}/api/farms/getfarm?userId=${userId}&role=${userRole}`
      )
      .then(async (res) => {

        if (res.status === 200) {
          if (!res.data.farms || res.data.farms.length === 0) {
            toast.error("No farms found ", { id: "no-farms" }); // Unique ID to prevent duplicates
            setFarms([]); // Ensure farms state is empty
            return; // Stop further execution
          } else {
            const fetchedFarms = res.data.farms || [];

            // Fetch districts, subdistricts, and villages for each farm
            const updatedFarms = await Promise.all(
              fetchedFarms.map(async (farm) => {
                const updatedFarm = {
                  ...farm,
                  districts: [],
                  subDistricts: [],
                  villages: [],
                };

                if (farm.state_id) {
                  try {
                    const districtRes = await axios.get(
                      `${BASE_URL}/api/districts/state/${farm.state_id}`
                    );
                    updatedFarm.districts = districtRes.data.districts || [];
                  } catch (error) {
                    console.error("Error fetching districts:", error);
                  }
                }

                if (farm.district_id) {
                  try {
                    const subDistrictRes = await axios.get(
                      `${BASE_URL}/api/subdistricts/district/${farm.district_id}`
                    );
                    updatedFarm.subDistricts =
                      subDistrictRes.data.subdistricts || [];
                  } catch (error) {
                    console.error("Error fetching subdistricts:", error);
                  }
                }

                if (farm.subdistrict_id) {
                  try {
                    const villageRes = await axios.get(
                      `${BASE_URL}/api/villages/subdistrict/${farm.subdistrict_id}`
                    );
                    updatedFarm.villages = villageRes.data || [];
                  } catch (error) {
                    console.error("Error fetching villages:", error);
                  }
                }

                return updatedFarm;
              })
            );

            setFarms(updatedFarms);
          }
        }
      })
      .catch((error) => {
        if (error.response?.data?.message === "No farms found ") {
          console.log("No farms found ");
          toast.error("No farms found ", { id: "no-farms" }); // Prevent duplicates
        } else {
          console.error(
            "Error fetching farm data:",
            error.response ? error.response.data : error
          );
          toast.error("Error fetching farm data", { id: "farm-error" }); // Unique ID
        }
      });
  }, [userId, userRole,BASE_URL]);

  const handleStateChange = async (index, state_id) => {
    const updatedFarms = [...farms];
    updatedFarms[index] = {
      ...updatedFarms[index],
      state_id,
      district_id: "",
      subdistrict_id: "",
      village_id: "",
      districts: [],
      subDistricts: [],
      villages: [],
    };

    try {
      const res = await axios.get(
        `${BASE_URL}/api/districts/state/${state_id}`
      );
      updatedFarms[index].districts = res.data.districts || [];
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Error fetching districts");
    }

    setFarms(updatedFarms);
  };

  const handleDistrictChange = async (index, district_id) => {
    const updatedFarms = [...farms];
    updatedFarms[index] = {
      ...updatedFarms[index],
      district_id,
      subdistrict_id: "",
      village_id: "",
      subDistricts: [],
      villages: [],
    };

    try {
      const res = await axios.get(
        `${BASE_URL}/api/subdistricts/district/${district_id}`
      );
      updatedFarms[index].subDistricts = res.data.subdistricts || [];
    } catch (error) {
      console.error("Error fetching subdistricts:", error);
      toast.error("Error fetching subdistricts");
    }

    setFarms(updatedFarms);
  };

  const handleSubDistrictChange = async (index, subdistrict_id) => {
    const updatedFarms = [...farms];
    updatedFarms[index] = {
      ...updatedFarms[index],
      subdistrict_id,
      village_id: "",
      villages: [],
    };

    try {
      const res = await axios.get(
        `${BASE_URL}/api/villages/subdistrict/${subdistrict_id}`
      );
      updatedFarms[index].villages = Array.isArray(res.data)
        ? res.data
        : res.data.villages || [];
    } catch (error) {
      console.error("Error fetching villages:", error);
      toast.error("Error fetching villages");
    }

    setFarms(updatedFarms);
  };

  const handleFarmChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFarms = [...farms];
    updatedFarms[index][name] = value;
    setFarms(updatedFarms);
  };

  const addFarmRow = () => {
    setFarms([
      ...farms,
      {
        state_id: "",
        district_id: "",
        subdistrict_id: "",
        village_id: "",
        surveyNumber: "",
        poatNumber: "",
        farmArea: "",
        districts: [],
        subDistricts: [],
        villages: [],
      },
    ]);
  };

  const removeFarmRow = async (index) => {
    const farmId = farms[index]._id; // Get the farm ID
    const userId = localStorage.getItem("userId");

    // Ask for confirmation before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this farm?"
    );

    if (isConfirmed) {
      try {
        await axios.delete(
          `${BASE_URL}/api/farms/delete/${farmId}`, // Pass farmId
          { headers: { Authorization: `Bearer ${userId}` } } // Include Authorization if needed
        );
        toast.success("Farm deleted successfully!");
        // Remove the farm from the frontend state after successful deletion
        setFarms(farms.filter((farm) => farm._id !== farmId));
      } catch (error) {
        toast.error("Failed to delete farm.");
        console.error("Error deleting farm:", error);
      }
    } else {
      // If not confirmed, just return and do nothing
      console.log("Farm deletion cancelled.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Check for empty required fields
    const isValid = farms.every((farm) => 
      farm.state_id && 
      farm.district_id && 
      farm.subdistrict_id && 
      farm.village_id &&
      farm.surveyNumber.trim() &&
      farm.poatNumber.trim() &&
      farm.farmArea.trim()
    );
  
    if (!isValid) {
      toast.error("Please fill in all required fields before saving.");
      return;
    }
  
    try {
      if (!userId) {
        toast.error("User ID is required. Please log in.");
        return;
      }
  
      const farmsData = farms.map((farm) => ({ ...farm }));
  
      await axios.post(
        `${BASE_URL}/api/farms/add`,
        { userId, farms: farmsData },
        { headers: { "Content-Type": "application/json" } }
      );
  
      toast.success("Farm details saved successfully!");
    } catch (error) {
      toast.error("Failed to save farm details.");
      console.error("Error saving farm details:", error);
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg dark:bg-black dark:text-white">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center dark:bg-black dark:text-white">
        Farm Details
      </h2>

      <div className="flex justify-between mb-4">
        <button
          onClick={addFarmRow}
          className="flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md shadow hover:bg-green-600 transition"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Farm
        </button>

        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow hover:bg-blue-600 transition"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-md shadow-md">
        <table className="w-full bg-white text-sm dark:bg-black dark:text-white">
          <thead className="bg-gray-200 text-gray-700 dark:bg-[#1b1c1c] dark:text-white">
            <tr>
              <th className="p-2 border">State</th>
              <th className="p-2 border">District</th>
              <th className="p-2 border">Sub-District</th>
              <th className="p-2 border">Village</th>
              <th className="p-2 border">Survey No.</th>
              <th className="p-2 border">Poat No.</th>
              <th className="p-2 border">Farm Area</th>
              <th className="p-2 border w-12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {farms.length > 0 ? (
              farms.map((farm, index) => (
                <tr key={index} className="text-center border">
                  <td className="p-2 border">
                    <select
                      value={farm.state_id}
                      onChange={(e) => handleStateChange(index, e.target.value)}
                      className="w-full p-1 border dark:bg-[#2f3030] dark:text-white"
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state._id} value={state._id}>
                          {state.state_name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-2 border">
                    <select
                      value={farm.district_id}
                      onChange={(e) =>
                        handleDistrictChange(index, e.target.value)
                      }
                      className="w-full p-1 border bg-white text-black dark:bg-[#2f3030] dark:text-white"
                    >
                      <option value="">Select District</option>
                      {Array.isArray(farm.districts) &&
                        farm.districts.map((district) => (
                          <option key={district._id} value={district._id}>
                            {district.district_name}
                          </option>
                        ))}
                    </select>
                  </td>

                  <td className="p-2 border">
                    <select
                      value={farm.subdistrict_id}
                      onChange={(e) =>
                        handleSubDistrictChange(index, e.target.value)
                      }
                      className="w-full p-1 border dark:bg-[#2f3030] dark:text-white"
                    >
                      <option value="">Select Sub-District</option>
                      {Array.isArray(farm.subDistricts) &&
                        farm.subDistricts.map((subdistrict) => (
                          <option key={subdistrict._id} value={subdistrict._id}>
                            {subdistrict.subdistrict_name}
                          </option>
                        ))}
                    </select>
                  </td>

                  <td className="p-2 border">
                    <select
                      value={farm.village_id}
                      onChange={(e) => handleFarmChange(index, e)}
                      name="village_id"
                      className="w-full p-1 border dark:bg-[#2f3030] dark:text-white"
                    >
                      <option value="">Select Village</option>
                      {Array.isArray(farm.villages) &&
                      farm.villages.length > 0 ? (
                        farm.villages.map((village) => (
                          <option key={village._id} value={village._id}>
                            {village.village_name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No villages available</option>
                      )}
                    </select>
                  </td>

                  <td className="p-2 border">
                    <input
                      type="text"
                      name="surveyNumber"
                      value={farm.surveyNumber}
                      onChange={(e) => handleFarmChange(index, e)}
                      className="w-full p-1 border dark:bg-[#2f3030] dark:text-white"
                    />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="text"
                      name="poatNumber"
                      value={farm.poatNumber}
                      onChange={(e) => handleFarmChange(index, e)}
                      className="w-full p-1 border dark:bg-[#2f3030] dark:text-white"
                    />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="text"
                      name="farmArea"
                      value={farm.farmArea}
                      onChange={(e) => handleFarmChange(index, e)}
                      className="w-full p-1 border dark:bg-[#2f3030] dark:text-white"
                    />
                  </td>

                  <td className="p-2 border">
                    <button
                      onClick={() => removeFarmRow(index)}
                      className="text-red-500"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-2 text-center">
                  No farm data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmDetails;
