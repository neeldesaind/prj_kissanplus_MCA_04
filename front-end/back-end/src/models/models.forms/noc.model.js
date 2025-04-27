import mongoose from "mongoose";

const nocSchema = new mongoose.Schema(
  {
    noc_id: { type: String, required: true, unique: true },
    profile_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    reason_for_noc: { type: String, required: true },
    isowner: { type: Boolean, default: false },
    isPending: { type: Boolean, default: true },
    isApprovedbyTalati: { type: Boolean, default: false },
    isApprovedbyTalatiAt: { type: Date, default: null },
    isDeniedbyTalati: { type: Boolean, default: false },
    isDeniedByTalatiAt: { type: Date, default: null }, 

    farm_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Farm" }],
  },
  { timestamps: true }
);

const Noc = mongoose.model("Noc", nocSchema);
export default Noc;
