import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./Signup.css";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setSnackbarMessage("Passwords do not match!");
      setSnackbarError(true);
      setShowSnackbar(true);
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/users");
      const existingUser = response.data.find(
        (user: any) => user.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (existingUser) {
        setSnackbarMessage("Email is already registered!");
        setSnackbarError(true);
        setShowSnackbar(true);
        return;
      }

      const newUser = {
        id: uuidv4().slice(0, 4),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: "user",
      };

      await axios.post("http://localhost:3000/users", newUser);
      setSnackbarMessage("User registered successfully!");
      setSnackbarError(false);
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Error registering user.");
      setSnackbarError(true);
      setShowSnackbar(true);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          <h1>ITicket</h1>
          <h2>Start your experience with ITicket today!</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Sign Up</button>

          <div className="login">
            <span>Already have an account? </span>
            <a href="/login" className="login-span">
              LOGIN
            </a>
          </div>
        </form>
      </div>

      {showSnackbar && (
        <div className={`snackbar${snackbarError ? " error" : ""}`}>
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};
