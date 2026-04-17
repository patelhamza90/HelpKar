import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError, handleSuccess } from "../../utils/utils";
import { FiSearch } from "react-icons/fi";
const BASE_URL = "https://helpkar.onrender.com";

const Applications = () => {

  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [statusMap, setStatusMap] = useState({});

  const fetchData = async () => {

    try {

      const url = `https://helpkar.onrender.com/api/admin/list/worker-application`;

      const { data } = await axios.get(url);

      setWorkers(data?.response || []);

    } catch (error) {
      handleError(error);
    }

  };

  const updateStatus = async (id) => {
    try {

      const status = statusMap[id];

      if (!status) return;

      const url = `https://helpkar.onrender.com/api/admin/update-status/${id}`;

      const { data } = await axios.put(url, {
        applicationStatus: status
      });

      if (data.success) {
        handleSuccess(data.message);
        fetchData(); // refresh list
      }

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

  return (

    <div className="table-container">

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
                SERVICE
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>
              <div className="th-content">
                WORKER ID
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>
              <div className="th-content">
                PHONE
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
                STATUS
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>
              <div className="th-content">
                DOCUMENTS
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>ACTION</th>

          </tr>

        </thead>

        <tbody>

          {paginated.map((app, index) => (

            <tr key={app._id}>

              <td>{start + index + 1}</td>

              <td className="font-bold">{app.fullName}</td>

              <td>{app.service}</td>

              <td>{app.workerUID}</td>

              <td>{app.phone}</td>

              <td>{app.workerUID}</td>

              <td>
                <span className="badge badge-gray">
                  {app.applicationStatus}
                </span>
              </td>

              <td>
                <div className="doc-actions">
                  <button
                    className="accept-btn"
                    onClick={() => window.open(app.idProof?.fileUrl, "_blank")}
                  >
                    View
                  </button>
                </div>
              </td>

              <td>

                <div className="action-box">

                  <select
                    value={statusMap[app._id] || app.applicationStatus}
                    disabled={app.applicationStatus !== "pending"}
                    onChange={(e) =>
                      setStatusMap({
                        ...statusMap,
                        [app._id]: e.target.value
                      })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accept</option>
                    <option value="rejected">Reject</option>
                  </select>



                  <button
                    className="accept-btn"
                    onClick={() => updateStatus(app._id)}
                  >
                    Update
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

export default Applications;