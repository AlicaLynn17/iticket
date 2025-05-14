import React from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.id) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" />; // or a "No Access" page
  }
  return children;
};