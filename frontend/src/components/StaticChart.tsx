import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface StaticChartProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

// Sample data for the charts
const barChartData = [
  { day: "1", Food: 300, Transport: 150, Entertainment: 100 },
  { day: "2", Food: 450, Transport: 200, Entertainment: 80 },
  { day: "3", Food: 280, Transport: 180, Entertainment: 120 },
  { day: "4", Food: 520, Transport: 160, Entertainment: 90 },
  { day: "5", Food: 380, Transport: 220, Entertainment: 150 },
  { day: "6", Food: 420, Transport: 190, Entertainment: 110 },
  { day: "7", Food: 350, Transport: 170, Entertainment: 130 },
  { day: "8", Food: 480, Transport: 210, Entertainment: 95 },
  { day: "9", Food: 320, Transport: 185, Entertainment: 140 },
  { day: "10", Food: 390, Transport: 175, Entertainment: 85 },
  { day: "11", Food: 410, Transport: 195, Entertainment: 105 },
  { day: "12", Food: 360, Transport: 165, Entertainment: 125 },
  { day: "13", Food: 440, Transport: 205, Entertainment: 115 },
  { day: "14", Food: 310, Transport: 155, Entertainment: 135 },
  { day: "15", Food: 470, Transport: 225, Entertainment: 145 },
  { day: "16", Food: 330, Transport: 180, Entertainment: 100 },
  { day: "17", Food: 400, Transport: 200, Entertainment: 120 },
  { day: "18", Food: 380, Transport: 170, Entertainment: 110 },
  { day: "19", Food: 450, Transport: 190, Entertainment: 130 },
  { day: "20", Food: 370, Transport: 185, Entertainment: 95 },
  { day: "21", Food: 420, Transport: 175, Entertainment: 140 },
  { day: "22", Food: 340, Transport: 195, Entertainment: 105 },
  { day: "23", Food: 490, Transport: 160, Entertainment: 125 },
  { day: "24", Food: 360, Transport: 210, Entertainment: 115 },
  { day: "25", Food: 430, Transport: 180, Entertainment: 135 },
  { day: "26", Food: 350, Transport: 200, Entertainment: 145 },
  { day: "27", Food: 460, Transport: 165, Entertainment: 100 },
  { day: "28", Food: 320, Transport: 195, Entertainment: 120 },
  { day: "29", Food: 400, Transport: 175, Entertainment: 110 },
  { day: "30", Food: 380, Transport: 185, Entertainment: 130 },
];

const StaticChart: React.FC<StaticChartProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">select the time period</span>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">start date</label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">end date</label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Bar dataKey="Food" stackId="a" fill="#1e40af" />
            <Bar dataKey="Transport" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Entertainment" stackId="a" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-800 rounded"></div>
          <span className="text-sm text-gray-600">Food</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Transport</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-300 rounded"></div>
          <span className="text-sm text-gray-600">Entertainment</span>
        </div>
      </div>
    </div>
  );
};

export default StaticChart;