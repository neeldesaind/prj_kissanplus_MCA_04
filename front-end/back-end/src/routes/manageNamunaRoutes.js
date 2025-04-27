// routes/manageNamunaRoutes.js

import express from "express";
import { createOrUpdateManageNamunaApplication, getManageNamunaApplications, deleteManageNamunaApplication } from "../controllers/manageNamunaController.js";

const router = express.Router();

router.post("/createOrUpdate", createOrUpdateManageNamunaApplication);
router.get("/", getManageNamunaApplications);
router.delete('/delete/:id', deleteManageNamunaApplication);


export default router;
