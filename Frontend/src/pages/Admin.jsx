import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../components/admin/Dashboard";
import ManageWorkers from "../components/admin/ManageWorkers";
import Applications from "../components/admin/Applications";
import Complaints from "../components/admin/Complaints";
import Reports from "../components/admin/Reports";
import "../styles/Admin.css";
import AdminSidebar from "../components/admin/AdminSidebar";

const Admin = () => {

  const adminName = "Admin";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/home";
  };

  return (
    <div className="admin-wrapper">

      <AdminSidebar adminName={adminName} handleLogout={handleLogout} />

      <div className="admin-main">

        <Routes>

          <Route path="/" element={<Navigate to="dashboard" />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="workers" element={<ManageWorkers />} />
          <Route path="applications" element={<Applications />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="reports" element={<Reports />} />

        </Routes>

      </div>

    </div>
  );
};

export default Admin;