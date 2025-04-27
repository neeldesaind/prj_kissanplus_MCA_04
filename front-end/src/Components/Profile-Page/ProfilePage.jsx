import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faEdit,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { useRef } from "react";
import loadingAnime from "../../assets/lottie/loadingAnime.json";
import Lottie from "lottie-react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProfilePage = () => {
  const [formData, setFormData] = useState({});
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewPic, setPreviewPic] = useState("");
  const [loading, setLoading] = useState({ villages: false });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
  const storedUserId = localStorage.getItem("userId");
  const [villages, setVillages] = useState([]);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState("");
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/states`);

        const extractedStates =
          response.data.states || response.data.data?.states || [];

        setStates(Array.isArray(extractedStates) ? extractedStates : []);
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      loadingRef.current = false;
      return;
    }

    loadingRef.current = true;
    axios
      .get(`${BASE_URL}/api/districts/state/${selectedState}`)
      .then((res) => {
        setDistricts(res.data.districts || []);
        setSelectedDistrict("");
        setSubDistricts([]);
        setVillages([]);
        setSelectedVillage("");
      })
      .catch(() => toast.error("Error fetching districts"))
      .finally(() => setLoading(false));
  }, [selectedState]);

  useEffect(() => {
    if (!selectedDistrict) {
      setSubDistricts([]);
      setSelectedSubDistrict("");
      setVillages([]);
      setSelectedVillage("");
      return;
    }

    axios
      .get(
        `${BASE_URL}/api/subdistricts/district/${selectedDistrict}`
      )
      .then((res) => {
        setSubDistricts(res.data.subdistricts || []);
      })
      .catch(() => toast.error("Error fetching sub-districts"));
  }, [selectedDistrict]);

  const loadingRef = useRef(false);

  useEffect(() => {
    if (!selectedSubDistrict) {
      setVillages([]);
      loadingRef.current = false;
      return;
    }

    loadingRef.current = true;

    axios
      .get(
        `${BASE_URL}/api/villages/subdistrict/${selectedSubDistrict}`
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          setVillages(res.data);
        } else {
          setVillages([]);
        }
        setSelectedVillage("");
      })
      .catch((error) => {
        console.error("Error fetching villages:", error);
        toast.error("Error fetching villages");
      })
      .finally(() => {
        loadingRef.current = false;
      });
  }, [selectedSubDistrict]);

  useEffect(() => {
    if (!storedUserId) {
      toast.error("User ID is missing. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/users/profile/${storedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        const {
          avatar,
          state_id,
          district_id,
          subdistrict_id,
          village_id,
          dob,
          middleName,
          
          ...restData
        } = response.data;

        const formattedDob = dob ? dob.split("T")[0] : "";

        setPreviewPic(avatar || "/Default-Profile/profile-default.jpg");

        setFormData((prevData) => ({
          ...prevData,
          ...restData,
          dob: formattedDob || prevData.dob || "",
          address: restData.address || prevData.address || "", // Preserve address
          middleName:
            middleName !== undefined ? middleName : prevData.middleName,
        }));

        if (state_id && states.some((s) => s._id === state_id)) {
          setSelectedState(state_id);
        }
        if (district_id && districts.some((d) => d._id === district_id)) {
          setSelectedDistrict(district_id);
        }
        if (
          subdistrict_id &&
          subDistricts.some((sd) => sd._id === subdistrict_id)
        ) {
          setSelectedSubDistrict(subdistrict_id);
        }
        if (village_id && villages.some((v) => v._id === village_id)) {
          setSelectedVillage(village_id);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [storedUserId, states, districts, subDistricts, villages]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDob = formData.dob
      ? new Date(formData.dob).toISOString()
      : null;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "dob") {
        data.append(key, formattedDob || "");
      } else {
        data.append(key, value);
      }
    });

    if (!formData.aadhar_number || formData.aadhar_number.length !== 12) {
      toast.error("Aadhar Number is required and must be 12 digits.");
      return; // Prevent form submission
    }

    data.append("state_id", selectedState || formData.state_id || "");
    data.append("district_id", selectedDistrict || formData.district_id || "");
    data.append(
      "subdistrict_id",
      selectedSubDistrict || formData.subdistrict_id || ""
    );
    data.append("village_id", selectedVillage || formData.village_id || "");

    if (profilePicFile) {
      data.append("avatar", profilePicFile);
    }

    try {
      await axios.put(
        `${BASE_URL}/api/users/profile/${storedUserId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Profile Updated Successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-4xl mx-auto ml-95">
      <h2 className="text-3xl text-gray-700 font-semibold mb-6">
        Your Profile
      </h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={previewPic}
                alt="Profile"
                className="border-4 border-gray-300 h-32 rounded-full w-32 object-cover"
              />
              {isEditing && (
                <>
                  <label
                    htmlFor="profilePic"
                    className="bg-gray-500 p-2 rounded-full text-white absolute bottom-0 cursor-pointer right-0"
                  >
                    <FontAwesomeIcon icon={faCamera} className="h-6 w-6" />
                  </label>
                  <input
                    type="file"
                    id="profilePic"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2 pb-1 border-b-2 border-gray-300">
              Personal Details
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              ["firstName", "First Name"],
              ["middleName", "Middle Name"],
              ["lastName", "Last Name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["dob", "Date of Birth"],
              ["aadhar_number", "Aadhar Number"],
              ["gender", "Gender"], // Added Gender field
            ].map(([field, label]) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="text-gray-700 block font-medium mb-1"
                >
                  {label}
                  {field === "aadhar_number" && <span className="text-red-500"> *</span>} 
                </label>

                {field === "gender" ? ( // Conditional rendering for gender dropdown
                  <select
                    id={field}
                    name={field}
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="bg-white border border-gray-300 p-2 rounded-md w-full disabled:bg-gray-200 disabled:text-gray-500"
                    disabled={!isEditing}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <input
                    id={field}
                    type={field === "dob" ? "date" : "text"}
                    name={field}
                    value={formData[field] || ""}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (field === "aadhar_number") {
                        value = value.replace(/\D/g, "").slice(0, 12);
                      }
                      if (field === "phone") {
                        value = value.replace(/\D/g, "").slice(0, 10);
                      }
                      setFormData({ ...formData, [field]: value });
                    }}
                    maxLength={
                      field === "aadhar_number"
                        ? 12
                        : field === "phone"
                        ? 10
                        : undefined
                    }
                    className="bg-white border border-gray-300 p-2 rounded-md w-full disabled:bg-gray-200 disabled:text-gray-500"
                    disabled={
                      !isEditing ||
                      ["firstName", "lastName", "email"].includes(field)
                    }
                    readOnly={field === "email"}
                  />
                )}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2 pb-1 border-b-2 border-gray-300 mt-10">
              Address Details
            </h2>
          </div>

          {/* Address Field (Separated) */}
          <div>
            <label
              htmlFor="address"
              className="text-gray-700 block font-medium mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3} // Multiline input
              className={`border border-gray-300 p-2 rounded-md w-full resize-none ${
                !isEditing
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white"
              }`}
              disabled={!isEditing} // Fully disables text input
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="text-gray-700 block font-medium mb-1 "
              
            >
              State <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border rounded disabled:bg-gray-200 disabled:text-gray-500"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={!isEditing}
              required
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.state_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="district"
              className="text-gray-700 block font-medium mb-1"
            >
              District  <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border rounded disabled:bg-gray-200 disabled:text-gray-500"
              value={selectedDistrict}
              onChange={(e) => {
                e.preventDefault();
                setSelectedDistrict(e.target.value);
              }}
              disabled={!isEditing || !selectedState}
              required
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district._id} value={district._id}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subDistrict"
              className="text-gray-700 block font-medium mb-1"
            >
              Sub-District  <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border rounded disabled:bg-gray-200 disabled:text-gray-500"
              value={selectedSubDistrict}
              onChange={(e) => setSelectedSubDistrict(e.target.value)}
              disabled={!isEditing || !selectedDistrict}
              required
            >
              <option value="">Select Sub-District</option>
              {subDistricts.map((subDistrict) => (
                <option key={subDistrict._id} value={subDistrict._id}>
                  {subDistrict.subdistrict_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="village"
              className="text-gray-700 block font-medium mb-1 disabled:bg-gray-200 disabled:text-gray-500"
              
            >
              Village  <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border rounded disabled:bg-gray-200 disabled:text-gray-500"
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              disabled={!isEditing || !selectedSubDistrict || loading.villages}
              required
            >
              <option value="">Select Village</option>
              {loading.villages ? (
                <option>Loading villages...</option>
              ) : villages.length > 0 ? (
                villages.map((village) => (
                  <option
                    key={village._id || village.village_name}
                    value={village._id}
                  >
                    {village.village_name}
                  </option>
                ))
              ) : (
                <option>No villages available</option>
              )}
            </select>
          </div>

          {/* ✅ Buttons for Edit, Cancel, and Update */}
          <div className="flex justify-end mt-6 space-x-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="bg-red-500 rounded-md text-white hover:bg-red-600 px-6 py-2"
                  onClick={() => setIsEditing(false)}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 rounded-md text-white hover:bg-green-700 px-6 py-2"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Update
                </button>
              </>
            ) : (
              <button
                type="button"
                className="bg-green-500 rounded-md text-white hover:bg-green-600 px-6 py-2"
                onClick={() => setIsEditing(true)}
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
