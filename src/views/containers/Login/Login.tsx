import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data;

      const matchedUser = users.find(
        (user: any) =>
          user.email === credentials.email &&
          user.password === credentials.password
      );

      if (matchedUser) {
        localStorage.setItem("authToken", "sampleToken");
        localStorage.setItem("user", JSON.stringify(matchedUser));
        setShowSnackbar(true);
        setTimeout(() => {
          setShowSnackbar(false);
          if (matchedUser.role === "admin" || matchedUser.role === "agent") {
            navigate("/dashboard");
          } else if (matchedUser.role === "user") {
            navigate("/view-tickets");
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
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
            <a href="/signup" className="login-span">
              SIGN UP
            </a>
          </div>
        </form>
      </div>
      {showSnackbar && (
        <div className="snackbar">Login Successful!</div>
      )}
    </div>
  );
};
