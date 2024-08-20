import React from 'react';

const DataTable = ({ filteredData }) => {
  return (
    <>
      <p className="dataCount">Showing {filteredData.length} rows</p>
      <table className="dataTable">
        <thead>
          <tr>
            <th>JobId</th>
            <th>User Name</th>
            <th>BikeName</th>
            <th>Status</th>
            <th>StartTime</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td>{item.JobId}</td>
              <td>{item.username}</td>
              <td>{item.Bikename}</td>
              <td>{item.Status}</td>
              <td>
                {new Date(item.StartTime).toLocaleString("en-US", {
                  hour12: true,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default DataTable;
