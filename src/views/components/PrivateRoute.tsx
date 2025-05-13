import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  return isAuthenticated ? children : <Navigate to="/login" />;
};