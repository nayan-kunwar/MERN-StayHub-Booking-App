import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

//Middleware for validating user input. 
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