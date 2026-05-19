import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AdminNavbar from './components/AdminNavbar'

const AdminLayout = () => {
 const cineAuth = JSON.parse(localStorage.getItem("cine_auth") || "{}");
  
  // Admin nahi hai to ghar bhejo
  if (!cineAuth?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    
      <Outlet />
    
  )
}

export default AdminLayout