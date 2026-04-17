import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError, handleSuccess } from "../../utils/utils";
import { FiSearch, FiCalendar } from "react-icons/fi";
const BASE_URL = "https://helpkar.onrender.com";

const Complaints = () => {

  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [responses, setResponses] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [dateFilter, setDateFilter] = useState("");


  const filtered = feedbacks.filter(f => {

    const matchSearch =
      (f.message || "").toLowerCase().includes(search.toLowerCase());

    const matchDate = dateFilter
      ? new Date(f.createdAt).toLocaleDateString() ===
      new Date(dateFilter).toLocaleDateString()
      : true;

    return matchSearch && matchDate;
  });

  const fetchData = async () => {

    try {
      const url = `https://helpkar.onrender.com/api/admin/list/user-feedback`;

      const { data } = await axios.get(url);

      setFeedbacks(data?.response || []);

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateComplaint = async (id) => {
    try {

      const payload = responses[id] || {};

      await axios.put(
        `https://helpkar.onrender.com/api/admin/update/complaint`,
        {
          id,
          status: payload.status || "resolved",
          message: payload.message || "Issue resolved"
        }
      );

      handleSuccess("Complaint updated successfully");
      fetchData();

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  };

  const getBadgeClass = (index) => {
    const classes = ["badge-green", "badge-gray", "badge-purple", "badge-blue"];
    return classes[index % classes.length];
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      " - " +
      d.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const start = (page - 1) * rowsPerPage;
  const paginated = filtered.slice(start, start + rowsPerPage);

  return (

    <div className="table-container">

      <div className="table-controls">

        <div className="ADsearch-box">
          <FiSearch className="ADsearch-icon" />
          <input
            type="text"
            placeholder="Search Complaint"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="control-btn ADdate date-range">
            <input
              type="date"
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
            />
            <FiCalendar />
          </div>

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
                COMPLAINTS
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>
              <div className="th-content">
                DATE CREATED
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>
              <div className="th-content">
                USER
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>
              <div className="th-content">
                STATUS
                <span className="sort">⇅</span>
              </div>
            </th>

            <th>ACTION</th>

          </tr>
        </thead>

        <tbody>

          {paginated.map((feed, index) => (

            <tr key={feed._id}>

              <td>{start + index + 1}</td>

              <td className="font-bold">
                {feed.message}
              </td>

              <td className="text-muted">
                {formatDate(feed.createdAt)}
              </td>

              <td>
                {feed.userId?.name || feed.userId}
              </td>

              <td>
                <span className={`badge ${getBadgeClass(index)}`}>
                  {feed.status}
                </span>
              </td>

              <td>

                <div className="action-box">

                  <textarea
                    placeholder="Admin response..."
                    disabled={feed.status === "resolved"}
                    value={responses[feed._id]?.message || ""}
                    onChange={(e) => {
                      setResponses({
                        ...responses,
                        [feed._id]: {
                          ...responses[feed._id],
                          message: e.target.value
                        }
                      })
                    }}
                  />

                  <select
                    disabled={feed.status === "resolved"}
                    value={responses[feed._id]?.status || feed.status}
                    onChange={(e) => {
                      setResponses({
                        ...responses,
                        [feed._id]: {
                          ...responses[feed._id],
                          status: e.target.value
                        }
                      })
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="reject">Reject</option>
                  </select>
                  <button
                    onClick={() => updateComplaint(feed._id)}
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
          </span> of {filtered.length} complaints
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

export default Complaints;