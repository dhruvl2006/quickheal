import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCalls from "../../../core/APICalls";
import Loader from "../../components/Loader";
import patientImage from "../../../assets/patient.png";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

// Password validation helper functions
const hasMinLength = (password) => password.length >= 8;
const hasUpperCase = (password) => /[A-Z]/.test(password);
const hasLowerCase = (password) => /[a-z]/.test(password);
const hasNumber = (password) => /\d/.test(password);
const hasSpecialChar = (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password);
const hasNoNullChar = (password) => !/\0/.test(password);
const hasNoSpaces = (password) => !/\s/.test(password);

const validatePassword = (password) => {
  const errors = [];
  if (!hasMinLength(password)) errors.push("At least 8 characters");
  if (!hasUpperCase(password)) errors.push("At least one uppercase letter");
  if (!hasLowerCase(password)) errors.push("At least one lowercase letter");
  if (!hasNumber(password)) errors.push("At least one number");
  if (!hasSpecialChar(password)) errors.push("At least one special character");
  if (!hasNoSpaces(password)) errors.push("No spaces allowed");
  if (!hasNoNullChar(password)) errors.push("Invalid characters detected");
  return errors;
};

const LoginComponent = ({ setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic password validation for login
    if (!password || password.includes('\0')) {
      setError("Invalid password format");
      return;
    }

    try {
      setLoader(true);
      const response = await apiCalls.loginPatient(email, password);
      if (response.status === 200) {
        window.localStorage.setItem("data", JSON.stringify(response.data.data));
        navigate("/dashboard/patient");
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-green-900 to-green-700">
      <FaArrowLeft 
        className="absolute top-4 left-4 text-white text-2xl cursor-pointer hover:scale-110 transition-transform animate__animated animate__fadeInLeft" 
        onClick={() => navigate('/')}
      />
      <div className="md:w-1/2 hidden md:flex items-center justify-center">
        <img
          src={patientImage}
          alt="Patient"
          className="w-3/4 animate__animated animate__fadeInLeft"
        />
      </div>
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg animate__animated animate__fadeInRight">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 md:hidden">
          <img
            src={patientImage}
            alt="Patient"
            className="w-24 h-24 rounded-full shadow-lg border-4 border-white"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-400">
          Patient Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button
            type="submit"
            className={`flex gap-2 justify-center w-full py-2 text-white bg-green-500 rounded-lg focus:outline-none transition-all duration-300 transform ${
              loader ? "opacity-70" : "hover:scale-105 hover:bg-green-600"
            } `}
            disabled={loader}
          >
            {loader && <div><Loader size="sm" /></div>}
            {loader ? "Logging..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => setIsLogin(false)}
            className="text-green-500 cursor-pointer hover:underline"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

const RegisterComponent = ({ setIsLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordErrors(validatePassword(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password requirements
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setError("Please fix all password requirements");
      return;
    }

    // Validate that passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoader(true);
      const response = await apiCalls.registerPatient(name, email, password, age);
      if (response.status === 201) {
        setIsLogin(true);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-green-900 to-green-700">
      <FaArrowLeft 
        className="absolute top-4 left-4 text-white text-2xl cursor-pointer hover:scale-110 transition-transform animate__animated animate__fadeInRight" 
        onClick={() => navigate('/')}
      />
      <div className="md:w-1/2 hidden md:flex items-center justify-center">
        <img
          src={patientImage}
          alt="Patient"
          className="w-3/4 animate__animated animate__fadeInLeft"
        />
      </div>
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg animate__animated animate__fadeInRight">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 md:hidden">
          <img
            src={patientImage}
            alt="Patient"
            className="w-24 h-24 rounded-full shadow-lg border-4 border-white"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-400">
          Patient Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordErrors.length > 0 && (
              <div className="mt-2 text-sm text-red-500">
                Password must have:
                <ul className="list-disc pl-5">
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}
          <button
            type="submit"
            className={`flex gap-2 justify-center w-full py-2 text-white bg-green-500 rounded-lg focus:outline-none transition-all duration-300 transform ${
              loader ? "opacity-70" : "hover:scale-105 hover:bg-green-600"
            } `}
            disabled={loader}
          >
            {loader && <div><Loader size="sm" /></div>}
            {loader ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => setIsLogin(true)}
            className="text-green-500 cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

const PatientAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <LoginComponent setIsLogin={setIsLogin} />
      ) : (
        <RegisterComponent setIsLogin={setIsLogin} />
      )}
    </div>
  );
};

export default PatientAuth;