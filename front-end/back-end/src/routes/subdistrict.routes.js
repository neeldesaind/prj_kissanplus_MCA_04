import express from "express";
import {
  addSubDistrict,
  updateSubDistrict,
  getSubDistrictsByDistrict,
  getSubDistrictsByID
} from "../controllers/subdistrictController.js";

const router = express.Router();

router.post("/", addSubDistrict);
router.put("/:id", updateSubDistrict);
router.get("/district/:district_id", getSubDistrictsByDistrict);
router.get('/:id', getSubDistrictsByID);

export default router;