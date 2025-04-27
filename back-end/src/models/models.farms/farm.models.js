import mongoose from "mongoose";

const FarmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    district_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    subdistrict_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubDistrict",
      required: true,
    },
    village_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village",
      required: true,
    },
    surveyNumber: { type: String, required: true },
    poatNumber: { type: String, required: true },
    farmArea: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Farm", FarmSchema);
