import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = ({ adminName, handleLogout }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Manage Workers", path: "/admin/workers" },
    { name: "Job Applications", path: "/admin/applications" },
    { name: "Complaints", path: "/admin/complaints" },
    { name: "Reports", path: "/admin/reports" }
  ];

  return (
    <div className="admin-sidebar">

      <div className="menu-section">
        <ul>
          {menu.map((item) => (
            <li
              key={item.name}
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="worker-profile-box">
        <div className="worker-avatar">{adminName.charAt(0)}</div>

        <div>
          <p className="worker-name">{adminName}</p>

          <button className="logout-btn1" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminSidebar;