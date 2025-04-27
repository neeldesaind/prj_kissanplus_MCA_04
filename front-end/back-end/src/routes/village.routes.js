import express from "express";
import { addVillage, getAllVillages, getVillagesBySubDistrict, updateVillage, getVillagesById } from "../controllers/villageController.js";

const router = express.Router();

router.post("/", addVillage); // Add a new village
router.get("/", getAllVillages); // Get all villages
router.get("/subdistrict/:subdistrict_id", getVillagesBySubDistrict);
router.put('/:village_id', updateVillage); // Route for updating the village
router.get('/:id', getVillagesById);

export default router;
