import React from 'react';
import './UserHomePage.css';

const JobsDashboard = ({ jobs }) => {
  return (
    <><h2 className="dashboardHeader">Jobs Dashboard</h2>
      <table className="dataTable">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>User Name</th>
            <th>Bike Name</th>
            <th>Start Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.JobId}</td>
              <td>{job.username}</td>
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
    </>
  );
};

export default JobsDashboard;
