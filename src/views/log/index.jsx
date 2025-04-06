import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../../utils/Constants.jsx";
import Notification from "../../components/notification/index.jsx";

import VisitLogs from './VisitLogs';
// import VisitLogProfile from './VisitLogProfile';
// import UpdateVisitLog from './UpdateVisitLog';
import CreateNewVisitLog from './CreateNewVisitLog';

const VisitLog = () => {
  const [selectedVisitLog, setSelectedVisitLog] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [addNewVisitLogModalOpen, setAddNewVisitLogModalOpen] = useState(false);
  const [createNewVisitLogModalOpen, setCreateNewVisitLogModalOpen] = useState(false);

  const handleActionClick = (action, VisitLog = null) => {
    if (VisitLog) setSelectedVisitLog(VisitLog);
    switch (action) {
      case 'view':
        setViewModalOpen(true);
        break;
      case 'update':
        setUpdateModalOpen(true);
        break;
      case 'addNewVisitLog':
        setAddNewVisitLogModalOpen(true);
        break;
      case 'pass':
        setCreateNewVisitLogModalOpen(true);
        setViewModalOpen(false);
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
          <CreateNewVisitLog open={createNewVisitLogModalOpen} onClose={() => setCreateNewVisitLogModalOpen(false)} VisitLog={selectedVisitLog} fetchData={fetchData} />
        </>
      )}
    </div>
  );
};

export default VisitLog;

