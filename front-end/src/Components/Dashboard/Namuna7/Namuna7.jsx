import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Namuna7 = () => {
  const [profileId, setProfileId] = useState("");
  const [isOwner] = useState(true);
  const [duesClearTillDate, setDuesClearTillDate] = useState("");
  const [duesCropName, setDuesCropName] = useState("");
  const [isApproved] = useState(false);
  const [selectedCanalId, setSelectedCanalId] = useState({});
  const [farmIds, setFarmIds] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isNamunaActive, setIsNamunaActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const checkNamunaDates = async () => {
      setLoading(true); // Move setLoading(true) here to avoid potential timing issues
      const namunaData = await fetchNamunaDates();
      
      if (namunaData && namunaData.length > 0) {
        const currentDate = new Date();
        const { startDate, endDate } = namunaData[0]; // Assuming there is only one active Namuna application
        setStartDate(startDate);
        setEndDate(endDate);
  
        const isWithinDateRange =
          currentDate >= new Date(startDate) && currentDate <= new Date(endDate);
  
        setIsNamunaActive(isWithinDateRange);
      } else {
        // Optional: Handle case where namunaData is empty or undefined
        setIsNamunaActive(false);
      }
  
      setLoading(false); // Reset loading state after checking
    };
  
    checkNamunaDates();
  }, []); // Empty dependency array to run only on mount
  
  

  
  const [formData, setFormData] = useState({
    farmerName: "",
    residentOf: "",
    subDistrict: "",
    district: "",
    sourceType: "Vehta Paani thi",
    ownerType: "Owner",
    year: "",
    season: "ekpaani",
    otherSeason: "",
    farmDetails: [
      {
        villageName: "",
        canalNumber: "",
        surveyNumber: "",
        poatNumber: "",
        totalAreaVigha: "",
        requestedWaterVigha: "",
        cropName: "",
        irrigationYear: "",
      },
    ],
  });
  const [userId, setUserId] = useState(null);
  const [farmCanals, setFarmCanals] = useState([[]]);
  useEffect(() => {

    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  const fetchNamunaDates = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/managenamuna`); // Update with your API endpoint
      const data = await response.json();
      return data; // Assuming the response returns an array of applications
    } catch (error) {
      console.error("Complete your profile and farm with location data.", error);
      return null;
    }
  };
  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ownerType: isOwner ? "owner" : "Representative",
    }));
  }, [isOwner]);
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);
  const fetchData = async () => {
    try {
      // Get user details
      const userRes = await axios.get(
        `${BASE_URL}/api/users/profile/${userId}`
      );
      const user = userRes.data;
      const profileRes = await axios.get(
        `${BASE_URL}/api/users/profile/${userId}`
      );
      const profile = profileRes.data;
      setProfileId(profile._id);
      const [districtRes, subdistrictRes, villageRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/districts/${profile.district_id}`),
        axios.get(`${BASE_URL}/api/subdistricts/${profile.subdistrict_id}`),
        axios.get(`${BASE_URL}/api/villages/${profile.village_id}`),
      ]);
      const districtName = districtRes.data.district_name || "";
      const subDistrictName = subdistrictRes.data.subdistrict_name || "";
      const villageName = villageRes.data.village_name || "";
      const farmsRes = await axios.get(`${BASE_URL}/api/farms/user/${userId}`);
      const farms = farmsRes.data || [];
      const ids = farms.map((farm) => farm._id);
      setFarmIds(ids);
      let enrichedFarms = [];
      let canalLists = [];
      if (farms.length > 0) {
        const results = await Promise.all(
          farms.map(async (farm) => {
            try {
              const [village, canals] = await Promise.all([
                axios.get(`${BASE_URL}/api/villages/${farm.village_id}`),
                axios.get(`${BASE_URL}/api/canals/village/${farm.village_id}`),
              ]);
              const enriched = {
                villageName: village.data.village_name || "",
                villageId: farm.village_id,
                canalNumber: canals.data.canals?.[0]?._id || "",
                surveyNumber: farm.surveyNumber,
                poatNumber: farm.poatNumber,
                totalAreaVigha: farm.farmArea,
                requestedWaterVigha: "",
                cropName: "",
                irrigationYear: "",
              };
              return {
                enrichedFarm: enriched,
                canalList: canals.data.canals || [],
              };
            } catch (error) {
              console.error(
                `Error fetching data for farm ${farm.village_id}:`,
                error
              );
              return {
                enrichedFarm: {
                  villageName: "",
                  villageId: farm.village_id,
                  canalNumber: "",
                  surveyNumber: farm.surveyNumber,
                  poatNumber: farm.poatNumber,
                  totalAreaVigha: farm.farmArea,
                  requestedWaterVigha: "",
                  cropName: "",
                  otherCropName: "",
                  irrigationYear: "",
                },
                canalList: [],
              };
            }
          })
        );
        enrichedFarms = results.map((r) => r.enrichedFarm);
        canalLists = results.map((r) => r.canalList);
      }
      if (enrichedFarms.length === 0) {
        enrichedFarms.push({
          villageName: "",
          villageId: "",
          canalNumber: "",
          surveyNumber: "",
          poatNumber: "",
          totalAreaVigha: "",
          requestedWaterVigha: "",
          cropName: "",
          otherCropName: "",
          irrigationYear: "",
        });
        canalLists.push([]);
      }
      setFormData((prev) => ({
        ...prev,
        farmerName: `${user.firstName} ${user.middleName || ""} ${
          user.lastName
        }`,
        residentOf: villageName,
        subDistrict: subDistrictName,
        district: districtName,
        farmDetails: enrichedFarms,
      }));
      setFarmCanals(canalLists);
    } catch (err) {
      toast.error("Complete your profile and farm with location data.");
      console.error("Error fetching Namuna7 data:", err);
    }
  };
  const handleInputChange = (e, index, field) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedFarms = [...formData.farmDetails];
      if (field === "cropName") {
        updatedFarms[index]["cropName"] = value;
        if (value !== "Other") {
          updatedFarms[index]["customCrop"] = "";
        }
      }
      // If typing in the custom crop input
      else if (field === "customCrop") {
        updatedFarms[index]["customCrop"] = value;
      }
      else {
        updatedFarms[index][field] = value;

        if (field === "villageName") {
          const selectedVillageId = value;
          fetchCanalsForFarm(index, selectedVillageId);
          updatedFarms[index]["villageId"] = selectedVillageId;
          updatedFarms[index]["canalNumber"] = "";
          const updatedCanalId = { ...selectedCanalId };
          updatedCanalId[selectedVillageId] = "";
          setSelectedCanalId(updatedCanalId);
        }
        if (field === "canalNumber") {
          updatedFarms[index]["canalNumber"] = value;
        }
      }
      setFormData((prev) => ({
        ...prev,
        farmDetails: updatedFarms,
      }));
    } else {
      if (name === "year") {
        setDuesClearTillDate(value);
      }
      if (name === "otherSeason") {
        setDuesCropName(value);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const fetchCanalsForFarm = async (index, villageId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/canals/village/${villageId}`);
      const newCanals = response.data.canals || [];
      const updatedCanals = [...farmCanals];
      updatedCanals[index] = newCanals;
      setFarmCanals(updatedCanals);
    } catch (error) {
      console.error(`Error fetching canals for village ${villageId}:`, error);
    }
  };
  const handleSeasonChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      season: value,
    }));
    if (value === "Other") {
      setDuesCropName(formData.otherSeason || ""); // If custom, set later when typing
    } else {
      setDuesCropName(value);
    }
  };
  const removeFarmRow = (index) => {
    const updated = [...formData.farmDetails];
    const updatedCanals = [...farmCanals];
    updated.splice(index, 1);
    updatedCanals.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      farmDetails: updated,
    }));
    setFarmCanals(updatedCanals);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sourceType || !formData.season || !formData.year) {
      toast.error("Please fill all required fields in the main form.");
      return;
    }
    for (let i = 0; i < formData.farmDetails.length; i++) {
      const farm = formData.farmDetails[i];
      if (
        !farm.villageName ||
        !farm.canalNumber ||
        !farm.surveyNumber ||
        !farm.poatNumber ||
        !farm.totalAreaVigha ||
        !farm.requestedWaterVigha ||
        !farm.cropName ||
        (farm.cropName === "Other" && !farm.customCrop) ||
        !farm.irrigationYear
      ) {
        toast.error(`Please fill all required fields in farm entry ${i + 1}`);
        return;
      }
      const totalArea = parseFloat(farm.totalAreaVigha);
      const requestedArea = parseFloat(farm.requestedWaterVigha);
      if (requestedArea > totalArea) {
        toast.error(`Requested area in farm entry ${i + 1} cannot be greater than total area`);
        return;
      }
    }
    try {
      const payload = {
        profile_id: profileId, // from backend or localStorage
        source_type:
          formData.sourceType === "Vehta Paani thi"
            ? "Vehta Paani thi"
            : "Udvahanthi",
        isOwner: isOwner,
        dues_Clear_till: duesClearTillDate || null,
        dues_crop_name: duesCropName || null,
        isApprovedbyTalati: isApproved,
        farmDetails: formData.farmDetails.map((farm, index) => ({
          // canalNumber: selectedCanalId[formData.farmDetails[0].canal_id],
          canal_id: farm.canalNumber,
          farm_id: farmIds[index],
          requested_water_vigha: parseFloat(farm.requestedWaterVigha),
          crop_name:
            farm.cropName === "Other" ? farm.customCrop : farm.cropName,
          //otherCropName: farm.otherCropName,
          irrigationYear: new Date(farm.irrigationYear),
        })),
      };
     

     const response = await axios.post(
        `${BASE_URL}/api/namuna7/saveNamuna7`,
        payload
      );
      if (response.data.message === "Namuna7 application has already been submitted for this date range.") {
        alert("You have already submitted an application for this date range.");
      } else {
        toast.success("Application submitted successfully!");
      }
    
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!isNamunaActive) {
    return (
      <div className="flex justify-center py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Namuna7 Application Not Active</h2>
        <p className="text-lg text-gray-600 mb-4">
          The Namuna7 application is currently not available. It is only active between <br />
          <strong>{formatDate(startDate)}</strong> and <strong>{formatDate(endDate)}</strong>.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Please check back later when the application period is active.
        </p>
        <button
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
          onClick={() => navigate("/side-bar/dashboard")}
          aria-label="Go to Dashboard"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
    
    );
  }

  return (
    <div className="flex flex-col p-6 space-y-6 bg-gray-100 min-h-screen ml-50">
      <div className="bg-white p-6 shadow-lg rounded-lg max-w-5xl mx-auto">
        <h4 className="text-xl font-bold mb-4 text-center">NAMUNO-7</h4>
        <h4 className="text-l font-bold mb-4 text-center">
          Application to Executive Engineer for supply of water from canal
        </h4>
        <div className="text-sm mb-4 space-y-2">
          <p>
            I
            <input
              type="text"
              name="farmerName"
              value={formData.farmerName}
              onChange={handleInputChange}
              className="border-b border-gray-500 focus:outline-none focus:border-black p-1 mx-2 text-sm w-40"
              placeholder="Farmer Name"
              disabled
            />
            Resident of
            <input
              type="text"
              name="residentOf"
              value={formData.residentOf}
              onChange={handleInputChange}
              className="border-b border-gray-500 focus:outline-none focus:border-black p-1 mx-2 text-sm w-40"
              placeholder="Resident of"
              disabled
            />
            Sub-District
            <input
              type="text"
              name="subDistrict"
              value={formData.subDistrict}
              onChange={handleInputChange}
              className="border-b border-gray-500 focus:outline-none focus:border-black p-1 mx-2 text-sm w-40"
              placeholder="Sub-District"
              disabled
            />
            District
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="border-b border-gray-500 focus:outline-none focus:border-black p-1 mx-2 text-sm w-40"
              placeholder="District"
              disabled
            />
          </p>

          <p>
            Source Type:
            <label className="ml-4 ">
              <input
                type="radio"
                name="sourceType"
                value="Vehta Paani thi"
                checked={formData.sourceType === "Vehta Paani thi"}
                onChange={handleInputChange}
                className="accent-green-600"
              />{" "}
              Vehta Paani thi
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="sourceType"
                value="Udvahanthi"
                checked={formData.sourceType === "Udvahanthi"}
                onChange={handleInputChange}
                className="accent-green-600"
              />{" "}
              Udvahanthi
            </label>
          </p>
          <p>
            To my farm under the Irrigation Act 1897, Mumbai, and under
            irrigation acts passed during that period and also under acts
            related to canals in Gujarat since 1962. I confirm and accept all
            the rules mentioned in this application. Under all the terms above,
            to receive water from the canal, I am writing this application.
          </p>
        </div>

        <hr className="border-y-green-500" />

        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300 text-sm mt-4">
            <thead>
              <tr className="bg-gray-300 text-gray-900 text-center">
                <th className="p-2 border">Village Name</th>
                <th className="p-2 border">Canal Name</th>
                <th className="p-2 border">Survey Number</th>
                <th className="p-2 border">Poat Number</th>
                <th className="p-2 border">Total Area (Vigha)</th>
                <th className="p-2 border">Requested Water (Vigha)</th>
                <th className="p-2 border">Crop Name</th>
                <th className="p-2 border">Irrigation Year</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.farmDetails.map((farm, index) => (
                <tr key={index} className="border text-center">
                  <td className="p-2 border w-30">
                    <input
                      type="text"
                      value={farm.villageName || ""}
                      readOnly
                      className="border rounded p-2 w-full text-sm bg-gray-100"
                      placeholder="Village Name"
                    />
                  </td>
                  <td className="p-2 border w-30">
                    <select
                      value={farm.canalNumber}
                      onChange={(e) =>
                        handleInputChange(e, index, "canalNumber")
                      }
                      className="border rounded p-2 w-full text-sm"
                    >
                      {/*<option value="">Select Canal</option> */}
                      {farmCanals[index]?.map((canal) => (
                        <option key={canal._id} value={canal._id}>
                          {canal.canal_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border w-25">
                    <input
                      type="text"
                      value={farm.surveyNumber}
                      onChange={(e) =>
                        handleInputChange(e, index, "surveyNumber")
                      }
                      className="border rounded p-2 w-full text-sm"
                      placeholder="Survey Number"
                      disabled
                    />
                  </td>
                  <td className="p-2 border w-25">
                    <input
                      type="text"
                      value={farm.poatNumber}
                      onChange={(e) =>
                        handleInputChange(e, index, "poatNumber")
                      }
                      className="border rounded p-2 w-full text-sm"
                      placeholder="Poat Number"
                      disabled
                    />
                  </td>
                  <td className="p-2 border w-20">
                    <input
                      type="text"
                      value={farm.totalAreaVigha}
                      onChange={(e) =>
                        handleInputChange(e, index, "totalAreaVigha")
                      }
                      className="border rounded p-2 w-full text-sm"
                      placeholder="Total Area"
                      disabled
                    />
                  </td>
                  <td className="p-2 border w-20">
                    <input
                      type="number"
                      min={1}
                      value={farm.requestedWaterVigha}
                      onChange={(e) =>
                        handleInputChange(e, index, "requestedWaterVigha")
                      }
                      className="border rounded p-2 w-full text-sm"
                      placeholder="Requested Water"
                    />
                  </td>
                  <td className="p-2 border">
                    <select
                      className="border rounded p-2 w-full text-sm"
                      name="cropName"
                      value={farm.cropName}
                      onChange={(e) => handleInputChange(e, index, "cropName")}
                    >
                      <option value="">Select Crop</option>
                      <option value="ekpaani">Ek-Paani</option>
                      <option value="kharif">Kharif</option>
                      <option value="ravi">Ravi</option>
                      <option value="bemosami">2 Mosami</option>
                      <option value="sherdi">Sherdi</option>
                      <option value="annual">Samanya Baarmashi</option>
                      <option value="Other">Other</option>
                    </select>

                    {farm.cropName === "Other" && (
                      <input
                        type="text"
                        className="border rounded p-2 w-full mt-2 text-sm"
                        placeholder="Enter other crop"
                        value={farm.customCrop || ""}
                        onChange={(e) =>
                          handleInputChange(e, index, "customCrop")
                        }
                      />
                    )}
                  </td>

                  <td className="p-2 border w-25">
                    <input
                      type="date"
                      value={
                        farm.irrigationYear
                          ? new Date(farm.irrigationYear)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange(e, index, "irrigationYear")
                      }
                      className="border rounded p-2 w-full text-sm"
                      placeholder="Irrigation Year"
                    />
                  </td>
                  <td className="p-2 border">
                    <button
                      type="button"
                      onClick={() => removeFarmRow(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr className="border-y-green-500" />

        <h4 className="text-lg font-bold mt-6">Declaration</h4>
        <p className="mb-3">
          2. I am{" "}
          <input
            type="text"
            value="Owner"
            disabled
            className="border rounded p-1 text-sm bg-gray-200 text-gray-700 w-32"
          />{" "}
          of land for which request application is made above.
        </p>

        <p className="mb-3">
          3. Till
          <select
            className="border rounded p-1 mx-2 text-sm"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          For
          <select
            className="border rounded p-1 mx-2 text-sm"
            name="season"
            value={formData.season}
            onChange={handleSeasonChange}
          >
            <option value="ekpaani">Ek-Paani</option>
            <option value="kharif">Kharif</option>
            <option value="ravi">Ravi</option>
            <option value="bemosami">2 Mosami</option>
            <option value="sherdi">Sherdi</option>
            <option value="annual">Samanya Baarmashi</option>
            <option value="Other">Others</option>
          </select>
          {formData.season === "Other" && (
            <input
              type="text"
              name="otherSeason"
              value={formData.otherSeason}
              onChange={handleInputChange}
              className="border rounded p-1 mx-2 text-sm w-40"
              placeholder="Other"
            />
          )}
        </p>

        <div className="text-end w-25">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Namuna7;
