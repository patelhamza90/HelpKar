import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError } from "../../utils/utils";

const BASE_URL = "https://helpkar.onrender.com";

const Reports = () => {

  const [type, setType] = useState("weekly");
  const [report, setReport] = useState({});
  const [table, setTable] = useState([]);

  const fetchReport = async () => {

    try {

      const { data } = await axios.get(
        `https://helpkar.onrender.com/api/admin/reports?type=${type}`
      );

      setReport(data.response);

      setTable(data.response.data);
      console.log(data.response.data);

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }

  };

  useEffect(() => {
    fetchReport();
  }, [type]);

  const downloadCSV = () => {

    const rows = [["User", "Worker", "Service", "Price", "Status", "Date"]];

    table.forEach(r => {
      rows.push([
        r.userId?.name,
        r.workerId?.fullName,
        r.workerId?.service,
        r.price,
        r.status,
        new Date(r.createdAt).toLocaleDateString()
      ]);
    });

    const csv = rows.map(r => r.join(",")).join("\n");

    const blob = new Blob([csv]);

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${type}-report.csv`;

    a.click();

  };

  return (

    <div>

      <h2 className="page-title">Reports</h2>

      <div className="report-controls">

        <button onClick={() => setType("weekly")}>Weekly</button>

        <button onClick={() => setType("monthly")}>Monthly</button>

        <button onClick={() => setType("yearly")}>Yearly</button>

        <button onClick={downloadCSV}>
          Download CSV
        </button>

      </div>

      <div className="report-cards">

        <div className="report-card">
          <h3>Total Bookings</h3>
          <p>{report.totalBookings}</p>
        </div>

        <div className="report-card">
          <h3>Accepted Jobs</h3>
          <p>{report.accepted}</p>
        </div>

        <div className="report-card">
          <h3>Rejected Jobs</h3>
          <p>{report.rejected}</p>
        </div>

        <div className="report-card">
          <h3>Total Revenue</h3>
          <p>₹{report?.revenue || 0}</p>
        </div>

      </div>

      <table className="data-table">

        <thead>
          <tr>
            <th>User</th>
            <th>Worker</th>
            <th>Service</th>
            <th>Price</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {table.map((r, i) => (
            <tr key={i}>
              <td>{r.userId?.name}</td>
              <td>{r.workerId?.fullName}</td>
              <td>{r.workerId?.service}</td>
              <td>₹{r.price}</td>
              <td>{r.status}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

};

export default Reports;