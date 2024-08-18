import React from 'react';
import './UserHomePage.css';

const JobsDashboard = ({ jobs }) => {
  return (
    <div className="dataTable">
      <h2 className="dashboardHeader">Jobs Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>User ID</th>
            <th>Bike Name</th>
            <th>Start Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.JobId}</td>
              <td>{job.UserId}</td>
              <td>{job.Bikename}</td>
              <td>
                {new Date(job.StartTime).toLocaleString("en-US", {
                  hour12: true,
                })}
              </td>
              <td>{job.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsDashboard;
