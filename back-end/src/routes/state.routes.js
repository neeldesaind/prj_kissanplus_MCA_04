import express from "express";
import {
  addState,
  getAllStates,
  getStateById,
  deleteState,
  updateState,
} from "../controllers/stateController.js";

const router = express.Router();

router.post("/add", addState);
router.get("/", getAllStates);
router.get("/:id", getStateById);
router.delete("/:id", deleteState);
router.put("/:id", updateState);

export default router;
