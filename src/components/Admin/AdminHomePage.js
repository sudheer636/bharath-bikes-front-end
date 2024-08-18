import React, { useState, useEffect } from "react";
import axios from "axios";
import { parseISO, isWithinInterval } from "date-fns";
import FilterSection from './FilterSection';
import ChartSection from './ChartSection';
import DataTable from './DataTable';

import "chart.js/auto";
import "./AdminHomePage.css";

const filterData = (data, userId, bikeName, startDate, endDate, status) => {
  return data.filter((item) => {
    const startTime = parseISO(item.StartTime);
    const start = startDate ? parseISO(startDate) : undefined;
    const end = endDate ? parseISO(endDate) : undefined;
    return (
      (!userId || item.UserId === userId) &&
      (!bikeName || item.Bikename.toLowerCase() === bikeName.toLowerCase()) &&
      (!start || !end || isWithinInterval(startTime, { start, end })) &&
      (!status || item.Status.toLowerCase() === status.toLowerCase())
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
  const [userId, setUserId] = useState("");
  const [bikeName, setBikeName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/user/my-jobs", {
        withCredentials: true,
      });
      setData(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.toString());
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = filterData(
      data,
      userId,
      bikeName,
      startDate,
      endDate,
      status
    );
    setFilteredData(filtered);
  }, [data, userId, bikeName, startDate, endDate, status]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error loading data: {error}</p>;

  const bikeNames = Array.from(new Set(data.map((item) => item.Bikename))).sort()
  const statuses = Array.from(new Set(data.map((item) => item.Status))).sort();

  const chartData = generateChartData(filteredData);
  const bikeChartData = generateBikeChartData(filteredData);

  return (
    <div className="adminDashboard">
      <h1 className="dashboardHeader">Admin Dashboard</h1>
      <FilterSection
        userId={userId}
        setUserId={setUserId}
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
      <ChartSection
        chartData={chartData}
        bikeChartData={bikeChartData}
      />
      <DataTable filteredData={filteredData} />
    </div>
  );
};

export default AdminHomePage;
