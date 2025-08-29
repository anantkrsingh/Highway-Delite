import express from "express";
import { googleLogin, login, registerUser, verifyOtp } from "../controllers/auth";
import { validateSignup, isRequestValidated, validateOTPReq, validateLogin } from "../middlewares/validator";
const router = express.Router();



router.post("/signup", validateSignup, isRequestValidated, registerUser);
router.post("/verify-otp", validateOTPReq, isRequestValidated, verifyOtp);
router.post("/login", validateLogin, isRequestValidated, login);
router.post("/google-login", googleLogin);

export default router;