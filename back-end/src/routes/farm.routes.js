import express from "express";
import { addFarmDetails, getFarmDetails, deleteFarmDetails, getFarmByUserId } from "../controllers/farmController.js";

const router = express.Router();

// Add farm details (Only for farmers)
router.post("/add", addFarmDetails);
router.get("/getfarm", getFarmDetails);
router.delete("/delete/:farmId", deleteFarmDetails);
router.get("/user/:userId", getFarmByUserId);

export default router;
