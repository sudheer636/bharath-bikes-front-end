import React from "react";
import "./UserHomePage.css";

const JobRow = ({ job }) => {
  return (
    <tr>
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
  );
};

export default JobRow;
