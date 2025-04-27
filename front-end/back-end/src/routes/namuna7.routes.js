import express from "express";
import { getNamuna7Data, saveNamuna7Data, getAllNamunaApplications, getSingleNamuna7, approveNamuna7, denyNamuna7, getNamuna7ByProfileId, updateDateOfSupply, getAllNamunaApplication} from "../controllers/namuna7Controller.js";

const router = express.Router();

router.get("/get-namuna7", getNamuna7Data);
router.post('/saveNamuna7', saveNamuna7Data);
router.get("/all", getAllNamunaApplications);
router.get("/alll", getAllNamunaApplication);
router.get("/:namuna_id", getSingleNamuna7);
router.put("/:id/approve", approveNamuna7);
router.put("/:id/deny", denyNamuna7);
router.get("/profile/:profileId", getNamuna7ByProfileId);
router.put('/update/:id', updateDateOfSupply);

export default router;