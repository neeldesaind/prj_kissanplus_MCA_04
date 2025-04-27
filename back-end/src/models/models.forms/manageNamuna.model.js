// models/ManageNamuna.js

import mongoose from "mongoose";

const manageNamunaSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ManageNamuna", manageNamunaSchema);
