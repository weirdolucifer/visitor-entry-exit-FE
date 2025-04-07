import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../../utils/Constants.jsx";
import Notification from "../../components/notification/index.jsx";

import VisitLogs from './VisitLogs';

const VisitLog = () => {
  const [selectedVisitLog, setSelectedVisitLog] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const handleOutTimeUpdate = async (visitLog) => {
    if (visitLog.out_datetime) {
      Notification.showErrorMessage("Already Updated", "Out time already exists for this log.");
      return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1 and pad
    const day = String(now.getDate()).padStart(2, '0'); // Pad single digits
    const hours = String(now.getHours()).padStart(2, '0'); // Pad single digits
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Pad single digits
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Pad single digits
    const currentTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  
    try {
      const response = await fetch(`${url}/passes/visit-log/${visitLog.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          out_datetime: currentTime,
        }),
      });
  
      const json = await response.json();
  
      if (response.ok) {
        Notification.showSuccessMessage("Success", "Out time updated successfully.");
        fetchData(); // Refresh list
      } else {
        Notification.showErrorMessage("Update Failed", json?.error || "Unable to update out time.");
      }
    } catch (err) {
      Notification.showErrorMessage("Error", "Server error while updating out time.");
    }
  };
  

  const handleActionClick = (action, VisitLog = null) => {
    if (VisitLog) setSelectedVisitLog(VisitLog);
    switch (action) {
      case 'view':
        setViewModalOpen(true);
        break;
      case 'update':
        handleOutTimeUpdate(VisitLog);
        break;
      default:
        console.log("Unhandled action:", action);
    }
  };

  let navigate = useNavigate();

  const [VisitLogData, setVisitLogData] = useState(null);
  const [totalVisitLog, setTotalVisitLog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    pass_type: '',
    visitor_name: '',
    visitor_id: '',
    in_date: '',
    out_date: '',
    offset: 0,
    limit: 10
  });


  const fetchData = async () => {
    setIsLoading(true);
    const queryString = new URLSearchParams(searchParams).toString();
    try {
      const response = await fetch(`${url}/passes/visit-log/?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setVisitLogData(json?.results);
        setTotalVisitLog(json?.count);
      } else {
        Notification.showErrorMessage("Try Again!", json.error);
      }
    } catch (err) {
      Notification.showErrorMessage("Error", "Server error!");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    fetchData();
  }, [searchParams]);

  return (
    <div>
      <VisitLogs VisitLog={VisitLogData} isLoading={isLoading} onActionClick={handleActionClick} searchParams={searchParams} setSearchParams={setSearchParams} totalVisitLog={totalVisitLog} />
      {selectedVisitLog && (
        <>
          {/* <VisitLogProfile open={viewModalOpen} onClose={() => setViewModalOpen(false)} VisitLog={selectedVisitLog} onActionClick={handleActionClick} /> */}
          {/* <UpdateVisitLog open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} VisitLog={selectedVisitLog} fetchData={fetchData} /> */}
        </>
      )}
    </div>
  );
};

export default VisitLog;

