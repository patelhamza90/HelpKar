import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleError, handleSuccess } from "../../utils/utils";
import '../../styles/WorkerTable.css';

const BASE_URL = "https://helpkar.onrender.com";

const WorkerRequests = () => {

  const workerToken = localStorage.getItem("workerToken");

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const fetchRecord = async () => {

    try {

      const url = `https://helpkar.onrender.com/api/booking/list/booking-request`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${workerToken}` }
      });

      if (!res.data.success) {
        handleError(res.data.message);
        return;
      }

      setData(res.data.response);

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const url = `https://helpkar.onrender.com/api/booking/change/action`;

      const res = await axios.put(
        url,
        { bookingId: id, action },
        { headers: { Authorization: `Bearer ${workerToken}` } }
      );

      if (!res.data.success) {
        handleError(res.data.message);
        return;
      }

      handleSuccess(res.data.message);

      fetchRecord();

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  const filtered = data.filter(item => {

    const matchSearch =
      item.userId?.name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter ? item.status === statusFilter : true;

    return matchSearch && matchStatus;

  });

  const start = (page - 1) * rowsPerPage;
  const paginated = filtered.slice(start, start + rowsPerPage);

  return (
    <div className="wrktbl-container">

      <div className="wrktbl-controls">

        <input
          className="wrktbl-search"
          placeholder="Search User"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="wrktbl-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className="wrktbl-filter"
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          <option value={5}>5 Row</option>
          <option value={8}>8 Row</option>
          <option value={10}>10 Row</option>
        </select>

      </div>

      <table className="wrktbl-table">

        <thead>

          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Service</th>
            <th>Address</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {paginated.map((item, index) => (

            <tr key={item._id}>

              <td>{start + index + 1}</td>

              <td>{item.userId?.name}</td>

              <td>{item.workerId?.service}</td>

              <td>{item.address}</td>

              <td>{item.bookingDate?.slice(0, 10)}</td>

              <td>{item.bookingTime}</td>

              <td>
                <span className={`wrk-badge ${item.status}`}>
                  {item.status}
                </span>
              </td>

              <td>

                {item.status === "pending" && (
                  <>
                    <button
                      className="wrk-accept"
                      onClick={() => handleAction(item._id, "accepted")}
                    >
                      Accept
                    </button>

                    <button
                      className="wrk-reject"
                      onClick={() => handleAction(item._id, "cancelled")}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {item.status === "accepted" && (
                  <button
                    className="wrk-complete"
                    onClick={() => handleAction(item._id, "completed")}
                  >
                    Complete
                  </button>
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default WorkerRequests;