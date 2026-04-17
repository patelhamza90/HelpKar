import React from "react";

const WorkerSidebar = ({ activeTab, setActiveTab, workerName, handleLogout }) => {
  return (
    <div className="worker-sidebar">
      <div className="menu-section">
        <ul>
          {["dashboard", "completed", "profile", "services","history", "settings"].map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div className="worker-profile-box">
        <div className="worker-avatar">{workerName.charAt(0)}</div>
        <div>
          <p className="worker-name">{workerName}</p>
          <button className="logout-btn1" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerSidebar;