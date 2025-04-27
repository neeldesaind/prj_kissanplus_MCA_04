import express from "express";
import { createNOC, getAllNOCs, approveNOC, denyNOC, getNOCById, getNOCsByUserId } from "../controllers/nocController.js";

const router = express.Router();

router.post("/create", createNOC);
router.get("/all", getAllNOCs);
router.put("/approve/:nocId", approveNOC); // Approve route
router.put("/deny/:nocId", denyNOC); // Deny route
router.get('/:nocId', getNOCById);
router.get("/user/:userId", getNOCsByUserId);



export default router;
