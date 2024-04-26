import { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";

// Middleware for validating register user input. 
// If any field missing out will throw error. 
// If empty string is there then will not through error but mongoose schema validation will through error
export const validateRegisterInput = [
  check("firstName", "First Name is required.").isString(),
  check("lastName", "Last Name is required.").isString(),
  check("email", "Email is required.").isEmail(),
  check("password", "Password must be at least 6 characters.").isLength({ min: 6 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // This wiil call registerUser controller as nothing goes wrong in above middleware.
  },
];

// Middleware for validating login user input. 
export const validateLoginUser = [
  check("email", "Email is required.").isEmail(),
  check("password", "Password must be at least 6 characters.").isLength({ min: 6 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // This wiil call loginUser controller as nothing goes wrong in above middleware.
  },
];

// Middleware for validating My Hotels input. 
export const myHotelsInput = [
  body("name").notEmpty().withMessage("Name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("type").notEmpty().withMessage("Hotel type is required"),
  body("pricePerNight")
    .notEmpty()
    .isNumeric()
    .withMessage("Price per night is required and must be a number"),
  body("facilities")
    .notEmpty()
    .isArray()
    .withMessage("Facilities are required"),
];