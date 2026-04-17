import axios from "axios";
import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../../utils/utils";
import { FiSearch, FiFilter, FiMoreVertical } from "react-icons/fi";

const BASE_URL = "https://helpkar.onrender.com";

const ManageWorkers = () => {

  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const fetchData = async () => {

    try {

      const url = `${BASE_URL}/api/admin/list/manage-worker`;

      const { data } = await axios.get(url);

      setWorkers(data?.response || []);
      console.log(data?.response || []);

    } catch (error) {
      handleError(error);
    }

  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = workers.filter(w =>
    w.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * rowsPerPage;

  const paginated = filtered.slice(start, start + rowsPerPage);

  const removeWorker = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {

      const { data } = await axios.delete(
        `${BASE_URL}/api/admin/remove-worker/${id}`
      );

      if (data.success) {
        handleSuccess("Worker removed successfully");
        fetchData();
      }

    } catch (error) {
      handleError(error.response?.data?.message || "Failed to remove ");
    }
  };

  return (

    <div className="table-container">

      <h2 className="page-title" style={{ padding: "20px" }}>Manage Workers</h2>

      <div className="table-controls">

        <div className="ADsearch-box">
          <FiSearch className="ADsearch-icon" />
          <input
            type="text"
            placeholder="Search Worker"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">

          <div className="control-btn">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>Show 5 Row</option>
              <option value={8}>Show 8 Row</option>
              <option value={10}>Show 10 Row</option>
              <option value={20}>Show 20 Row</option>
            </select>
          </div>

        </div>

      </div>

      <table className="data-table">

        <thead>

          <tr>

            <th>ID</th>

            <th>
              <div className="th-content">
                NAME
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>
              <div className="th-content">
                WORKER UID
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>
              <div className="th-content">
                SERVICE
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>
              <div className="th-content">
                JOBS COMPLETED
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>
              <div className="th-content">
                PHONE
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>ACTION</th>

          </tr>

        </thead>

        <tbody>

          {paginated.map((worker, index) => (

            <tr key={worker._id}>

              <td>{start + index + 1}</td>

              <td className="font-bold">{worker.fullName}</td>

              <td className="font-bold">{worker.workerUID}</td>

              <td>{worker.service}</td>

              <td>{worker.jobsCompleted}</td>

              <td>{worker.phone}</td>

              <td>

                <div className="action-box">

                  <button
                    className="delete-btn"
                    onClick={() => removeWorker(worker._id)}
                  >
                    Remove
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="table-footer">

        <div className="showing-text">
          <span className="text-blue font-bold">
            Showing {paginated.length}
          </span> of {filtered.length} workers
        </div>

        <div className="pagination">

          {Array.from({ length: Math.ceil(filtered.length / rowsPerPage) }, (_, i) => (
            <button
              key={i}
              className={`page-num ${page === i + 1 ? "active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

        </div>

        <div className="go-to-page">
          <span>Go to page</span>
          <input
            type="text"
            defaultValue={page}
            onChange={(e) => setPage(Number(e.target.value))}
          />
        </div>

      </div>

    </div>

  );

};

export default ManageWorkers;