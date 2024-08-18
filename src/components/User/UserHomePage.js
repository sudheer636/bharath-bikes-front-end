import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserHomePage.css";
import JobsDashboard from "./JobDashBoard";

function UserHomePage() {
  const [jobs, setJobs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingJobId, setProcessingJobId] = useState(null);
  const selectedBike = localStorage.getItem("selectedBike");
  const duration = {
    "Bike1": 1000,
    "Bike2": 2000,
    "Bike3": 3000,
  };

  useEffect(() => {
    fetchJobs();
    const storedJobId = localStorage.getItem("processingJobId");
    if (storedJobId) {
      setProcessingJobId(storedJobId);
      setIsProcessing(true);
    }
  }, []);

  useEffect(() => {
    if (processingJobId) {
      const interval = setInterval(() => {
        checkJobStatus(processingJobId);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [processingJobId]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/my-jobs", {
        withCredentials: true,
      });
      setJobs(response.data || []);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    }
  };

  const checkJobStatus = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:3001/user/job-status/${jobId}`, {
        withCredentials: true,
      });
      if (response.data.status === "Completed") {
        setIsProcessing(false);
        setProcessingJobId(null);
        localStorage.removeItem("processingJobId");
        fetchJobs();
      }
    } catch (error) {
      console.log("Error checking job status:", error);
    }
  };

  const startProcess = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/user/start-process",
        { duration: duration[selectedBike] },
        {
          withCredentials: true,
        }
      );
      if (response.status === 429) {
        alert("Process already running");
        setIsProcessing(false);
      } else {
        console.log("Process started successfully----", response.data);
        const jobId = response.data.JobId;
        setProcessingJobId(jobId);
        localStorage.setItem("processingJobId", jobId);
        fetchJobs(); 
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert("Process already running");
      } else {
        console.log("Error starting process:", error);
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="home-page">
      <div className="header">
        <h1 className="greeting">Hello, {localStorage.getItem("username")}!</h1>
        <div className="selected-bike">
          Selected Bike: {selectedBike}
        </div>
      </div>
      <button
        className="start-button"
        onClick={startProcess}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Start"}
      </button>
      <JobsDashboard jobs={jobs} />
    </div>
  );
}

export default UserHomePage;
