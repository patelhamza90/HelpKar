import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleError } from "../../utils/utils";
import "../../styles/WorkerTable.css";
const BASE_URL = "https://helpkar.onrender.com";

const WorkerHistory = ({ workerToken }) => {

  const [data, setData] = useState([]);

  const fetchHistory = async () => {

    try {

      const url = `https://helpkar.onrender.com/api/booking/list/worker-history`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${workerToken}` }
      });

      if (!res.data.success) {
        handleError(res.data.message);
        return;
      }

      setData(res.data.response);

    } catch (error) {
      handleError(error.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (

    <div className="wrktbl-container">

      <table className="wrktbl-table">

        <thead>
          <tr>
            <th>User</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Review</th>
          </tr>
        </thead>

        <tbody>

          {data.map((item) => (

            <tr key={item._id}>

              <td>{item.userId?.name}</td>

              <td>{item.serviceId?.title}</td>

              <td>{item.bookingDate?.slice(0,10)}</td>

              <td>
                <span className={`wrk-badge ${item.status}`}>
                  {item.status}
                </span>
              </td>

              <td>
                {item.rating ? `⭐ ${item.rating}` : "-"}
              </td>

              <td>
                {item.review || "-"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
};

export default WorkerHistory;