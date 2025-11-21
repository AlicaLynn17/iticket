import React, { useState } from "react";
import bcrypt from "bcryptjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./Signup.css";
import { TicketSnackbar } from "../../components/TicketComponents/TicketSnackbar";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
const [showSnackbar, setShowSnackbar] = useState(false);
const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success" as "success" | "error",
});


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.password.length < 7) {
    setSnackbar({
      open: true,
      message: "Password must be at least 7 characters long!",
      severity: "error",
    });
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setSnackbar({
      open: true,
      message: "Password does not match!",
      severity: "error",
    });
    return;

  }

  const newUser = {
    email: formData.email,
    name: `${formData.firstName} ${formData.lastName}`,
    password: formData.password,
    role: "User",
    createdBy: null, 
    createdTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  };


try {
  await axios.post("https://localhost:5001/api/Account/Register", newUser);
  setShowSnackbar(true);

setTimeout(() => {
  setShowSnackbar(false);
  navigate("/login");
}, 1000);

} catch (err) {
  console.error(err);
  setSnackbar({
      open: true,
      message: "Error registering user.",
      severity: "error",
    });
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

        <button type="submit">Sign Up</button>

        <div className="login">
            <span>Already have an account? </span>
            <a href="/login" className="login-span">
                LOGIN
            </a>
        </div>

      </form>

      <TicketSnackbar
  open={showSnackbar}
  message="User registered successfully!"
  severity="success"
  onClose={() => setShowSnackbar(false)}
/>

    </div>

  </div>
);
};
