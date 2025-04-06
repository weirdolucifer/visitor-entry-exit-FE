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


  function calculateMinutesBetweenDates(startTime, endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const diffInMs = endDate - startDate;
    const minutes = diffInMs / 60000;
    return Math.max(0, Math.round(minutes));
  }

  const currentTime = new Date().toISOString();

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

  const counts = {
    "9am":
      todayVisitorData[`${today} 09:00:00`] +
      todayVisitorData[`${today} 09:30:00`],
    "10am":
      todayVisitorData[`${today} 10:00:00`] +
      todayVisitorData[`${today} 10:30:00`],
    "11am":
      todayVisitorData[`${today} 11:00:00`] +
      todayVisitorData[`${today} 11:30:00`],
    "12pm":
      todayVisitorData[`${today} 12:00:00`] +
      todayVisitorData[`${today} 12:30:00`],
    "1pm":
      todayVisitorData[`${today} 13:00:00`] +
      todayVisitorData[`${today} 13:30:00`],
    "2pm":
      todayVisitorData[`${today} 14:00:00`] +
      todayVisitorData[`${today} 14:30:00`],
    "3pm":
      todayVisitorData[`${today} 15:00:00`] +
      todayVisitorData[`${today} 15:30:00`],
    "4pm":
      todayVisitorData[`${today} 16:00:00`] +
      todayVisitorData[`${today} 16:30:00`],
    "5pm":
      todayVisitorData[`${today} 17:00:00`] +
      todayVisitorData[`${today} 17:30:00`],
    "6pm": todayVisitorData[`${today} 18:00:00`],
    "7pm": 0,
  };

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
          <h2 class="text-lg font-bold mb-3">Weekly Visitors</h2>
          <div className="h-64 p-4">
            <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Today Visits */}
        <div className="bg-white border rounded shadow p-4 h-80">
          <h2 class="text-lg font-bold mb-3">Today's Visitors</h2>
          <div className="h-64 p-4">
            <Line
              data={lineChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Number of People in Zones */}
        <div className="bg-white border rounded shadow p-4 h-80">
          <h2 class="text-lg font-bold mb-3">Today's Stats</h2>
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
