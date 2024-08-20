import React from 'react';

const FilterSection = ({
  username,
  setUsername,
  bikeName,
  setBikeName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  status,
  setStatus,
  bikeNames,
  statuses,
}) => {
  return (
    <div className="filterSection">
      <label className="filterLabel">User Name:</label>
      <input
        className="filterInput"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="filterLabel">Bike Name:</label>
      <select
        className="filterSelect"
        value={bikeName}
        onChange={(e) => setBikeName(e.target.value)}
      >
        <option value="">All Bikes</option>
        {bikeNames.map((bike) => (
          <option key={bike} value={bike}>
            {bike}
          </option>
        ))}
      </select>
      <label className="filterLabel">Status:</label>
      <select
        className="filterSelect"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Status</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <label className="filterLabel">Start Date:</label>
      <input
        className="filterInput"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label className="filterLabel">End Date:</label>
      <input
        className="filterInput"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>
  );
};

export default FilterSection;
