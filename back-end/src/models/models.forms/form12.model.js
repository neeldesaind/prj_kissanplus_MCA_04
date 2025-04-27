import mongoose from "mongoose";

const form12Schema = new mongoose.Schema(
  {
    form_12_id: {
      type: String,
      required: true,
    },
    namuna_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Namuna",
      required: true,
    },
    profile_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    rate_per_vigha: {
      type: Number,
      required: true,
    },
    total_rate: {
      type: Number,
      required: true,
    },
    isApprovedByEngineer: {
      type: Boolean,
      default: false,
    },
    isDeniedByEngineer: {
      type: Boolean,
      default: false,
    },
    approvedByEngineerAt: { type: Date, default: null },
    deniedByEngineerAt: { type: Date, default: null },
    isPending: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Form12 = mongoose.model("Form12", form12Schema);

export default Form12;
