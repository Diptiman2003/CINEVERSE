import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedUserRoute = () => {
  const cineAuth = JSON.parse(localStorage.getItem("cine_auth") || "{}");

  // Admin hai to admin page bhejo
  if (cineAuth?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default ProtectedUserRoute;