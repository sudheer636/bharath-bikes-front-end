import React from 'react';
import { Pie } from 'react-chartjs-2';

const ChartSection = ({ chartData, bikeChartData }) => {
  return (
    <div className="chartSection">
      <div className="pieChart">
        <h2>Status Distribution</h2>
        <Pie data={chartData} />
      </div>
      <div className="pieChart">
        <h2>Bike Distribution</h2>
        <Pie data={bikeChartData} />
      </div>
    </div>
  );
};

export default ChartSection;
