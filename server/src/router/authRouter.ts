import { config } from "dotenv";
config();
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor";
import Patient from "../models/Patient";
import Role from "../types/role";
import { body, validationResult } from 'express-validator';
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;
const validateSignup = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('age')
    .isInt({ min: 0 })
    .withMessage('Age must be a positive number'),
];
interface IDoctorRegister {
  name: string;
  email: string;
  password: string;
  specialization: string;
}
interface IPatientRegister {
  name: string;
  email: string;
  password: string;
  age: string;
}
interface ILogin {
  email: string;
  password: string;
}

// Doctor Registration
router.post(
  "/doctor/register",
  async (req: Request<{}, {}, IDoctorRegister, null>, res: Response) => {
    const { name, email, password, specialization } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const doctor = new Doctor({
        name,
        email,
        password: hashedPassword,
        specialization,
      });

      const savedDoctor = await doctor.save();
      res.status(201).json({
        message: "Doctor registered successfully",
        doctor: savedDoctor,
      });
    } catch (err: any) {
      res
        .status(500)
        .json({ error: "Error registering doctor", details: err.message });
    }
  }
);

// Patient Registration
router.post(
  "/patient/register",
  validateSignup,
  async (req: Request<{}, {}, IPatientRegister>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Explicit return to stop execution
    }

    const { name, email, password, age } = req.body;
    
    try {
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        res.status(400).json({ error: "Email already registered" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const patient = new Patient({ name, email, password: hashedPassword, age });
      const savedPatient = await patient.save();

      res.status(201).json({
        message: "Patient registered successfully",
        patient: savedPatient,
      });

    } catch (err: any) {
      if (err.name === 'ValidationError') {
        res.status(400).json({ 
          error: "Validation Error",
          details: Object.values(err.errors).map((e: any) => e.message)
        });
        return;
      }
      
      res.status(500).json({ 
        error: "Error registering patient", 
        details: err.message 
      });
    }
  }
);
// Doctor Login
router.post(
  "/doctor/login",
  async (req: Request<{}, {}, ILogin, null>, res: Response) => {
    const { email, password } = req.body;
    try {
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        res.status(404).json({ error: "Doctor not found" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid password" });
        return;
      }

      res.json({
        message: "Login successful",
        data: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          approved: doctor.approved,
          connectionType: Role.DOCTOR,
        },
      });
      return;
    } catch (err: any) {
      res.status(500).json({ error: "Error logging in", details: err.message });
    }
  }
);

// Patient Login
router.post(
  "/patient/login",
  async (req: Request<{}, {}, ILogin, null>, res: Response) => {
    const { email, password } = req.body;
    try {
      const patient = await Patient.findOne({ email });

      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, patient.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid password" });
        return;
      }

      res.json({
        message: "Login successful",
        data: {
          id: patient._id,
          email: patient.email,
          name: patient.name,
          age: patient.age,
          connectionType: Role.PATIENT,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: "Error logging in", details: err.message });
    }
  }
);

export default router;
