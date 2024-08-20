import React, { useState, useEffect } from "react";
import axios from "axios";
import { parseISO, isAfter, isBefore, isEqual } from "date-fns";
import { useNavigate } from "react-router-dom";
import FilterSection from "./FilterSection";
import ChartSection from "./ChartSection";
import DataTable from "./DataTable";
import { baseUrl } from "../../App";

import "chart.js/auto";
import "./AdminHomePage.css";

const filterData = (data, username, bikeName, startDate, endDate, status) => {
  return data.filter((item) => {
    const startTime = parseISO(item.StartTime);
    const start = startDate ? parseISO(startDate) : null;
    const end = endDate ? parseISO(endDate) : null;
    const itemUsername = String(item.username).toLowerCase();
    const searchUsername = String(username).toLowerCase();
    const withinStart = start ? isAfter(startTime, start) || isEqual(startTime, start) : true;
    const withinEnd = end ? isBefore(startTime, end) || isEqual(startTime, end) : true;

    return (
      (!username || itemUsername === searchUsername) &&
      (!bikeName || (item.Bikename || "").toLowerCase() === bikeName.toLowerCase()) &&
      (withinStart && withinEnd) &&
      (!status || (item.Status || "").toLowerCase() === status.toLowerCase())
    );
  });
};

const generateChartData = (filteredData) => {
  const statusCounts = filteredData.reduce((acc, item) => {
    acc[item.Status] = (acc[item.Status] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };
};

const generateBikeChartData = (filteredData) => {
  const bikeCounts = filteredData.reduce((acc, item) => {
    acc[item.Bikename] = (acc[item.Bikename] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(bikeCounts),
    datasets: [
      {
        data: Object.values(bikeCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };
};

const AdminHomePage = () => {
  const [username, setUsername] = useState("");
  const [bikeName, setBikeName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/user/my-jobs`, {
        withCredentials: true,
      });
      setData(response.data || []);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          await axios.get(`${baseUrl}/api/auth/refresh-token`, {
            withCredentials: true,
          });

          const retryResponse = await axios.get(`${baseUrl}/api/user/my-jobs`, {
            withCredentials: true,
          });
          setData(retryResponse.data || []);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          setError(refreshError.toString());
          navigate("/api/timeout");
        }
      } else {
        console.error("Error fetching jobs:", error);
        setError(error.toString());
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      navigate("/api/auth/login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = filterData(
      data,
      username,
      bikeName,
      startDate,
      endDate,
      status
    );
    setFilteredData(filtered);
  }, [data, username, bikeName, startDate, endDate, status]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error loading data: {error}</p>;

  const bikeNames = Array.from(
    new Set(data.map((item) => item.Bikename))
  ).sort();
  const statuses = Array.from(new Set(data.map((item) => item.Status))).sort();

  const chartData = generateChartData(filteredData);
  const bikeChartData = generateBikeChartData(filteredData);

  return (
    <div className="adminDashboard">
      <h1 className="dashboardHeader">Admin Dashboard</h1>
      <FilterSection
        username={username}
        setUsername={setUsername}
        bikeName={bikeName}
        setBikeName={setBikeName}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        status={status}
        setStatus={setStatus}
        bikeNames={bikeNames}
        statuses={statuses}
      />
      <ChartSection chartData={chartData} bikeChartData={bikeChartData} />
      <DataTable filteredData={filteredData} />
      <div className="logout-button-container">
        <button className="start-button" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHomePage;
