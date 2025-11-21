import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { TicketSnackbar } from "../../components/TicketComponents/TicketSnackbar";
export const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:5001/api/Account/Login",
        {
          email: credentials.email,
          password: credentials.password,
        },
        { withCredentials: true }
      );

      const user = response.data.user;

      localStorage.setItem("authToken", "backendToken"); 
      localStorage.setItem("user", JSON.stringify(user));

      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
        if (user.role === "admin" || user.role === "agent") {
          navigate("/dashboard");
        } else {
          navigate("/view-tickets");
        }
      }, 1000);

    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        alert("Invalid email or password.");
      } else {
        alert("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          <h1>ITicket</h1>
          <h3 className="welcome">WELCOME BACK</h3>
          <h2>Continue to your Account.</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Login</button>

          <div className="login">
            <span>Don’t have an account? </span>
            <a href="/signup" className="login-span">SIGN UP</a>
          </div>
        </form>
      </div>
      <TicketSnackbar
  open={showSnackbar}
  message="Login successful!"
  severity="success"
  onClose={() => setShowSnackbar(false)}
/>

    </div>
  );
};
