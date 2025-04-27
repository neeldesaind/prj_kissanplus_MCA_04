import { Router } from "express";
import { userRegister, verifyEmail, userLogin, refreshAccessToken } from "../controllers/userController.js";
import { forgotPassword } from "../controllers/forgotPasswordController.js";
import { resetPassword } from "../controllers/resetPasswordController.js";
import { checkEmailExists } from "../controllers/forgotPasswordController.js";
import { getUserProfile,updateProfile } from "../controllers/profileController.js";
import {upload} from '../utils/config/multerConfig.js';
import { changePassword } from "../controllers/authController.js";
import { addUser } from "../controllers/userController.js";
import { getUsersList, getUserById } from "../controllers/userController.js";

const router = Router();

router.post("/register", userRegister);
router.get("/profile/:userId", getUserProfile);
router.put('/profile/:userId', upload.single('avatar'), updateProfile);


router.get("/verify/:token", verifyEmail);
router.post("/login", userLogin);
router.post("/refresh-token", refreshAccessToken);

router.post('/forgot-password', forgotPassword);
router.post("/reset-password/:token", resetPassword); // Only POST route needed now
router.post("/check-email", checkEmailExists);

router.put("/change-password/:userId", changePassword);
router.post("/add-user", addUser);
router.get("/view-user", getUsersList);

router.get('/view-user/:id', getUserById);


export default router;
