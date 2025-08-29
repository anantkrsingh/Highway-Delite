import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateSignup = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("dob")
        .notEmpty().withMessage("Date of birth is required")
        .isISO8601().withMessage("Date of birth must be a valid date (YYYY-MM-DD)")
        .toDate()
];

export const validateOTPReq = [
    body("otp")
        .notEmpty().withMessage("OTP is required")
        .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits long")
    ,
    body("email").notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
]

export const validateLogin = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Valid Email is required "),
]


export const isRequestValidated = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}