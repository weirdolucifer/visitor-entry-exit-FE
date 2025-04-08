import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { url } from "../../utils/Constants";
import Notification from "../../components/notification/index.jsx";
import "chart.js/auto";

const Dashboard = () => {
  const [todayVisitorData, setTodayVisitorData] = useState({});
  const [weeklyVisitorData, setWeeklyVisitorData] = useState({});
  const [todayStatsData, setTodayStatsData] = useState({});

  const getTodaysStats = async () => {
    try {
      const response = await fetch(`${url}/passes/visit-stats/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setTodayStatsData(json);
      } else {
        Notification.showErrorMessage("Try Again!", json.error);
      }
    } catch (err) {
      Notification.showErrorMessage("Error", "Server error!");
    }
  };

  const getTodayVisitorVisitDashboard = async () => {
    try {
      const response = await fetch(`${url}/passes/today-visitor-visit/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setTodayVisitorData(json);
      } else {
        Notification.showErrorMessage("Try Again!", json.error);
      }
    } catch (err) {
      Notification.showErrorMessage("Error", "Server error!");
    }
  };

  const formatDate = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const today = formatDate(new Date());

  // Define the expected time slots
  const expectedTimeSlots = [
    "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00",
    "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00",
    "15:00:00", "15:30:00", "16:00:00", "16:30:00", "17:00:00", "17:30:00",
    "18:00:00", "18:30:00", "19:00:00",
  ];

  // Populate counts with the expected time slots, filling missing slots with 0
  const counts = {};

  // Loop through the expected times and fill in missing data from the API
  expectedTimeSlots.forEach((time) => {
    const key = `${today} ${time}`;
    counts[time] = todayVisitorData[key] || 0;  // If no data, set 0
  });

  // Now, include the actual timestamps from the API response
  Object.keys(todayVisitorData).forEach((timestamp) => {
    const time = timestamp.split(" ")[1];  // Extract time part
    counts[time] = todayVisitorData[timestamp];  // Override with actual data
  });

  const lineChartData = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Visits",
        data: Object.values(counts),
        fill: true,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const getWeeklyVisitorVisit = async () => {
    try {
      const response = await fetch(`${url}/passes/weekly-visitor-visit/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setWeeklyVisitorData(json);
      } else {
        Notification.showErrorMessage("Try Again!", json.error);
      }
    } catch (err) {
      Notification.showErrorMessage("Error", "Server error!");
    }
  };

  const barChartData = {
    labels: Object.keys(weeklyVisitorData),
    datasets: [
      {
        label: "Weekly Visitors",
        data: Object.values(weeklyVisitorData),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  useEffect(() => {
    getTodaysStats();
    getTodayVisitorVisitDashboard();
    getWeeklyVisitorVisit();
  }, []);

  return (
    <div className="p-6">
      {/* Chart row */}
      <div className="m-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly Visitors */}
        <div className="bg-white border rounded shadow p-4 h-80">
          <h2 className="text-lg font-bold mb-3">Weekly Visitors</h2>
          <div className="h-64 p-4">
            <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Today Visits */}
        <div className="bg-white border rounded shadow p-4 h-80">
          <h2 className="text-lg font-bold mb-3">Today's Visitors</h2>
          <div className="h-64 p-4">
            <Line
              data={lineChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Number of People in Zones */}
        <div className="bg-white border rounded shadow p-4 h-80">
          <h2 className="text-lg font-bold mb-3">Today's Stats</h2>
          <div className="h-64 p-4">
            <h3 className="text-lg p-4 border-b">
              Passes Issued Today: {todayStatsData.passes_issued_today}
            </h3>
            <h3 className="text-lg p-4 border-b">
              Passes Expiring Today: {todayStatsData.passes_expiring_today}
            </h3>
            <h3 className="text-lg p-4 border-b">
              Visitors Inside Premise: {todayStatsData.persons_still_in}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
