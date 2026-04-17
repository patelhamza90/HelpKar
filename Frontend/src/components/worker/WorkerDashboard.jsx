import React, { useEffect, useState } from "react";
import WorkerRequests from "./WorkerRequests";
import { handleError } from "../../utils/utils";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const WorkerDashboard = ({ workerToken, requests = [] }) => {

  const [data, setData] = useState({
    totalEarning: 0,
    overallRating: 0,
    taskComplete: 0,
    taskPending: 0
  });

  const fetchRecord = async () => {
    try {

      const url = `${BASE_URL}/api/booking/list/worker-data`;

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${workerToken}` }
      });

      if (!data.success) {
        return handleError(data.message);
      }

      setData(data.response);

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  return (
    <>

      <div className="stats">

        <div className="stat-card">
          <h2>{data.taskPending}</h2>
          <span>Pending Jobs</span>
        </div>

        <div className="stat-card green">
          <h2>{data.taskComplete}</h2>
          <span>Completed</span>
        </div>

        <div className="stat-card purple">
          <h2>₹ {data.totalEarning}</h2>
          <span>Total Earnings</span>
        </div>

        <div className="stat-card blue">
          <h2>{data.overallRating?.toFixed(1) || 0}</h2>
          <span>Overall Rating</span>
        </div>

      </div>

      {requests && requests.length > 0 ? (
        <WorkerRequests
          data={requests.slice(0, 2)}
          title="Incoming Requests"
        />
      ) : (
        <h4 style={{ marginTop: "20px", color: "#777" }}>
          No pending requests
        </h4>
      )}

    </>
  );
};

export default WorkerDashboard;