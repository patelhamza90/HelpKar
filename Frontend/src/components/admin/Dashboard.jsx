import React, { useState, useEffect } from "react";
import { handleError } from "../../utils/utils";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {

const [workerData, setWorkerData] = useState({
  totalWorkers: 0,
  todayBookings: 0,
  weeklyRevenue: 0,
  avgRating: 0
});

  const [worker, setWorker] = useState([]);

  const fetchData = async () => {
    try {

      const url = `${BASE_URL}/api/admin/list/worker-data`;

      const { data } = await axios.get(url);

      setWorker(data?.response?.topWorkers || []);

      setWorkerData(data.response);


    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      <h2 className="page-title">Admin Dashboard</h2>

      <div className="ADstats-grid">

        <div className="ADstat-card">
          <h2>{workerData.totalWorkers || 0}</h2>
          <span>Total Workers</span>
        </div>

        <div className="ADstat-card green">
          <h2>{workerData.todayBookings}</h2>
          <span>Today's Bookings</span>
        </div>

        <div className="ADstat-card purple">
          <h2>₹{workerData.weeklyRevenue}</h2>
          <span>Weekly Revenue</span>
        </div>

        <div className="ADstat-card blue">
          <h2>{workerData.avgRating?.toFixed(1) || 0} ⭐</h2>
          <span>Avg Rating</span>
        </div>

      </div>

      <div className="dashboard-section">

        <div className="top-workers">
          <h2>Top Performing Workers</h2>

          <div className="worker-grid">
            {worker.length > 0 ? (
              worker.map((w, i) => (
                <div className="worker-card" key={i}>
                  <div className="rank">#{i + 1}</div>

                  <h3>{w.name}</h3>

                  <p>{w.service}</p>

                  <div className="worker-info">
                    <span>Jobs: {w.jobsCompleted}</span>
                    <span><FontAwesomeIcon icon={faPhone} /> {w.phone}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No workers found</p>
            )}
          </div>
        </div>

      </div>

    </>
  );
};

export default Dashboard;