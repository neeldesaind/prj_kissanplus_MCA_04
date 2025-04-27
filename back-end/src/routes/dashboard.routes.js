import express from "express";
import {
  getUserPayments,
  getUserNocs,
  getUserNamunas,
  getUserExemptions,
  getForm12DashboardData,
  getTotalIncome,
  getWaterRequests,
  getTalatiDashboardData,
  getEngineerDashboardData,
  getAdminDashboardData
} from "../controllers/DashboardController.js"; // Import controller methods

const router = express.Router();

router.get("/user/:userId/payments", getUserPayments);
router.get("/user/:userId/nocs", getUserNocs);
router.get("/user/:userId/namunas", getUserNamunas);
router.get("/user/:userId/exemptions", getUserExemptions);
router.get("/user/:userId/form12", getForm12DashboardData);
router.get("/total-income", getTotalIncome);
router.get("/water-requests", getWaterRequests);
router.get("/talati-data", getTalatiDashboardData);
router.get("/engineer-data", getEngineerDashboardData);
router.get("/admin-data", getAdminDashboardData); // New route for admin dashboard data

export default router;
