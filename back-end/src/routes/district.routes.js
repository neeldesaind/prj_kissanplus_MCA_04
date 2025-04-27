import express from "express";
import {
  addDistrict,
  updateDistrict,
  getDistrictsByState,
  getDistrictsById,
} from "../controllers/districtController.js";

const router = express.Router();
router.post("/", addDistrict);
router.put("/:id", updateDistrict);
router.get("/state/:stateId", getDistrictsByState); // Get districts by state ID
router.get('/:id', getDistrictsById);

export default router;