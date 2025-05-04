import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const NOCApplication = () => {
  const [reason, setReason] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [farmDetails, setFarmDetails] = useState([]);
  const [profileId, setProfileId] = useState("");
  const [farmIds, setFarmIds] = useState([]);
  const [otherReason, setOtherReason] = useState("");
  const [userData, setUserData] = useState({
    farmerName: "",
    village: "",
    subDistrict: "",
    district: "",
  });

  const handleDeleteFarm = (indexToDelete) => {
    if (farmDetails.length <= 1) {
      toast.error("At least one farm detail must be present.");
      return;
    }

    const updatedFarms = farmDetails.filter(
      (_, index) => index !== indexToDelete
    );
    setFarmDetails(updatedFarms);
    setFarmIds(updatedFarms.map((farm) => farm._id)); // keep farmIds updated too
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role");
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/users/profile/${storedUserId}`
        );
        const data = res.data;

        setProfileId(data._id);

        let districtList = [],
          subDistrictList = [],
          villageList = [];

        try {
          const [districtsRes, subDistrictsRes, villagesRes] =
            await Promise.all([
              axios.get(`${BASE_URL}/api/districts/state/${data.state_id}`),
              axios.get(
                `${BASE_URL}/api/subdistricts/district/${data.district_id}`
              ),
              axios.get(
                `${BASE_URL}/api/villages/subdistrict/${data.subdistrict_id}`
              ),
            ]);

          districtList = districtsRes.data.districts || [];
          subDistrictList = subDistrictsRes.data.subdistricts || [];
          villageList = villagesRes.data || [];
        } catch (locationErr) {
          console.error(
            "Failed to fetch district/sub-district/village:",
            locationErr
          );
          toast.error("Complete your profile and farm with location data.");
        }

        const district = districtList.find((d) => d._id === data.district_id);
        const subDistrict = subDistrictList.find(
          (s) => s._id === data.subdistrict_id
        );
        const village = villageList.find((v) => v._id === data.village_id);

        setUserData({
          farmerName: `${data.firstName || ""} ${data.middleName || ""} ${
            data.lastName || ""
          }`.trim(),
          district: district?.district_name || data.district_id,
          subDistrict: subDistrict?.subdistrict_name || data.subdistrict_id,
          village: village?.village_name || data.village_id,
        });

        // FARM FETCH
        try {
          const farmRes = await axios.get(
            `${BASE_URL}/api/farms/getfarm?userId=${storedUserId}&role=${userRole}`
          );

          const farmArray = Array.isArray(farmRes.data)
            ? farmRes.data
            : farmRes.data.farms || [];

          if (!farmArray.length) {
            toast.error("No farms found. Please add farms in your profile.");
            return;
          }

          const farmsWithVillageNames = await Promise.all(
            farmArray.map(async (farm) => {
              try {
                const villageRes = await axios.get(`${BASE_URL}/api/villages/${farm.village_id}`);
                return {
                  ...farm,
                  villageName: villageRes.data.village_name || "",
                };
              } catch (err) {
                console.warn(`Failed to fetch village for ${farm.village_id}`);
                return {
                  ...farm,
                  villageName: "", // fallback
                };
              }
            })
          );
          

          setFarmDetails(farmsWithVillageNames);
          setFarmIds(farmsWithVillageNames.map((farm) => farm._id));
          console.log("Farm IDs:", farmsWithVillageNames);
        } catch (farmErr) {
          console.error("Farm fetch error:", farmErr);
          toast.error("Add Farm data in farm");
        }
      } catch (profileErr) {
        console.error("Profile fetch error:", profileErr);
        toast.error("Failed to load user profile.");
      }
    };

    if (storedUserId && BASE_URL) {
      fetchUserData();
    }
  }, []);



  const handleSubmit = async () => {
    toast.dismiss();
    const payload = {
      profile_id: profileId,
      reason_for_noc: reason === "Other" ? otherReason : reason,
      isowner: isChecked,
      farm_ids: farmIds,
    };

    toast
      .promise(axios.post(`${BASE_URL}/api/noc/create`, payload), {
        loading: "Submitting NOC...",
        success: "NOC application submitted successfully!",
        error: (err) =>
          err?.response?.data?.message || "Something went wrong. Try again.",
      })
      .then(() => {
        setReason("");
        setIsChecked(false);
      });
  };

  return (
    <div className="max-w-5xl mx-auto ml-90 mb-10 mt-6 dark:bg-black dark:text-white">
      <div className="bg-white shadow-md rounded-lg p-6 text-black dark:bg-black dark:text-gray-100">
        <h1 className="text-2xl font-bold text-center mb-2">Application</h1>
        <h1 className="text-l font-bold text-center mb-4">
          Application for No Objection Certificate (NOC)
        </h1>

        <div className="mb-6 p-4 rounded-md bg-gray-50 text-black dark:bg-black dark:text-gray-100">
          <h2 className="text-lg font-semibold mb-4">Declaration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="mr-2">I</span>
              <input
                type="text"
                className="border-b border-gray-500 bg-transparent p-2 flex-1 focus:outline-none"
                value={userData.farmerName}
                disabled
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">from Village</span>
              <input
                type="text"
                className="border-b border-gray-500 bg-transparent p-2 flex-1 focus:outline-none"
                value={userData.village}
                disabled
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">Sub-District</span>
              <input
                type="text"
                className="border-b border-gray-500 bg-transparent p-2 flex-1 focus:outline-none"
                value={userData.subDistrict}
                disabled
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">District</span>
              <input
                type="text"
                className="border-b border-gray-500 bg-transparent p-2 flex-1 focus:outline-none"
                value={userData.district}
                disabled
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2">
              I assure the concerned person that there are no pending fees or
              payments left to be paid by me. Hence, I kindly request the
              concerned authority to issue a No Objection Certificate for the
              following reason:
            </p>
            <div className="inline-flex gap-4 items-center">
              <select
                className="border-b border-gray-500 bg-transparent p-2 focus:outline-none focus:border-black text-black dark:bg-black dark:text-gray-100"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="" disabled>
                  Choose...
                </option>
                <option value="Land Transfer">Land Transfer</option>
                <option value="Bank Loan">Bank Loan</option>
                <option value="Other">Other</option>
              </select>
              {reason === "Other" && (
  <input
    type="text"
    className="border-b border-gray-500 bg-transparent p-2 w-40 focus:outline-none focus:border-black"
    placeholder="Other Reason"
    value={otherReason}
    onChange={(e) => setOtherReason(e.target.value)}
  />
)}
            </div>
          </div>
        </div>

        <hr className="border-y-green-500" />

        <div className="mb-6 p-4 rounded-md bg-gray-50 shadow-lg text-black dark:bg-black dark:text-gray-100">
          <h2 className="text-lg font-semibold mb-2">Farm Details</h2>
          <p className="text-sm text-gray-500 mb-4">
            Please fill in the farm details below.
          </p>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse text-sm px-1">
              <thead>
                <tr className="text-left">
                  <th>Village Name</th>
                  <th>Survey Number</th>
                  <th>Poat Number</th>
                  <th>Total Area</th>
                  {farmDetails.length > 1 && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {farmDetails.map((farm, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={farm.villageName || ""}
                        readOnly
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border p-2 rounded w-full dark:bg-black dark:text-gray-100"
                        value={farm.surveyNumber || ""}
                        readOnly
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={farm.poatNumber || ""}
                        readOnly
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={farm.farmArea || ""}
                        readOnly
                      />
                    </td>
                    {farmDetails.length > 1 && (
                      <td className="p-2">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                          onClick={() => handleDeleteFarm(index)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-y-green-500" />

        <p className="mb-3 ml-5 mt-4 flex items-center text-xs leading-relaxed">
          <input
            type="checkbox"
            id="ownerDeclarationCheckbox"
            className="mr-3 scale-150 accent-green-600"
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="ownerDeclarationCheckbox" className="inline-block">
            I confirm that the information provided above is true to the best of
            my knowledge and belief. I am responsible for any discrepancies
            found in the information provided above.
          </label>
        </p>

        <div className="text-center">
          <button
            className={`px-6 py-2 rounded ${
              isChecked
                ? "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
                : "bg-gray-200 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!isChecked}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NOCApplication;
