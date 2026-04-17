import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Worker.css";
import WorkerSidebar from "../components/worker/WorkerSidebar";
import WorkerServices from "../components/worker/WorkerServices";
import WorkerRequests from "../components/worker/WorkerRequests";
import WorkerProfile from "../components/worker/WorkerProfile";
import axios from "axios";
import { handleError } from "../utils/utils";
import WorkerDashboard from "../components/worker/WorkerDashboard";
import WorkerHistory from "../components/worker/WorkerHistory";

const Worker = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [requests, setRequests] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [workerName, setWorkerName] = useState("");

  const [user, setUser] = useState('');

  const workerToken = localStorage.getItem('workerToken');

  useEffect(() => {
    const name = localStorage.getItem("workerName") || "Worker";
    setWorkerName(name);
    setRequests([
      { id: 1, name: "Priya Sharma", service: "Leaking Tap", urgent: true },
      { id: 2, name: "Amit Verma", service: "Switchboard Repair", urgent: false },
      { id: 3, name: "Sara Mehta", service: "Wardrobe Fitting", urgent: false },
    ]);
    setCompleted([
      { id: 4, name: "Rohit Kumar", service: "Fan Repair" },
      { id: 5, name: "Anjali Singh", service: "Pipe Fixing" },
    ]);
  }, []);

  const fetchDetails = async () => {
    try {

      if (!workerToken) {
        console.log("No token found");
        return;
      }

      const url = "http://localhost:8000/api/worker/worker-dashboard";
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${workerToken}`
        }
      });

      setUser(data)
    }
    catch (err) {
      handleError(err);
    }
  }

  useEffect(() => {

    fetchDetails();

  }, []);

  const handleLogout = () => {
  localStorage.clear();
  navigate("/home");
};

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <WorkerDashboard
            workerToken={workerToken}
            requests={requests}
            completed={completed}
          />
        );
      case "completed": return <WorkerRequests workerToken={workerToken} data={completed} title="Completed Jobs" isCompleted={true} />;
      case "history":
        return <WorkerHistory workerToken={workerToken} />;

      case "profile":
        return <WorkerProfile user={user} setUser={setUser} />;

      case "settings": return <div className="simple-box"><h2>Settings</h2><p>Notifications: ON</p><p>Availability: Online</p></div>;
      case "services":
        return (
          <WorkerServices />
        );
      default: return null;
    }
  };

  return (
    <div className="worker-wrapper">
      <WorkerSidebar activeTab={activeTab} setActiveTab={setActiveTab} workerName={workerName} handleLogout={handleLogout} />
      <div className="worker-main">
        <h1 className="title">Worker Dashboard</h1>
        <p className="subtitle">Manage your requests and track your performance</p>
        {renderContent()}
      </div>
    </div>
  );
};

export default Worker;