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
    role: "user",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const newUser = {
      id: uuidv4().slice(0, 4), 
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    try {
      await axios.post("http://localhost:3000/users", newUser);
      alert("User registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error registering user.");
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
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select name="role" id="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit">Sign Up</button>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <span>Already have an account? </span>
            <a href="/login" style={{ color: "#3C5759", fontWeight: "bold", textDecoration: "none" }}>
                Log in
            </a>
        </div>

      </form>
    </div>

  </div>
);
};
