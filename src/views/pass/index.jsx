import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../../utils/Constants.jsx";
import Notification from "../../components/notification/index.jsx";

import Passes from './Passes.jsx';
// import PassProfile from './PassProfile';
// import UpdatePass from './UpdatePass';
import CreateNewPass from '../pass/CreateNewPass';

const Pass = () => {
  const [selectedPass, setSelectedPass] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [addNewPassModalOpen, setAddNewPassModalOpen] = useState(false);
  const [createNewPassModalOpen, setCreateNewPassModalOpen] = useState(false);

  const handleActionClick = (action, Pass = null) => {
    if (Pass) setSelectedPass(Pass);
    switch (action) {
      case 'view':
        setViewModalOpen(true);
        break;
      case 'update':
        setUpdateModalOpen(true);
        break;
      case 'addNewPass':
        setAddNewPassModalOpen(true);
        break;
      case 'pass':
        setCreateNewPassModalOpen(true);
        setViewModalOpen(false);
        break;
      default:
        console.log("Unhandled action:", action);
    }
  };

  let navigate = useNavigate();

  const [PassData, setPassData] = useState(null);
  const [totalPass, setTotalPass] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    pass_type: '',
    visitor_name: '',
    visitor_id: '',
    offset: 0,
    limit: 10,
    active: true,
  });


  const fetchData = async () => {
    setIsLoading(true);
    const queryString = new URLSearchParams(searchParams).toString();
    try {
      const response = await fetch(`${url}/passes/pass-info/?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setPassData(json?.results);
        setTotalPass(json?.count);
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
      <Passes Pass={PassData} isLoading={isLoading} onActionClick={handleActionClick} searchParams={searchParams} setSearchParams={setSearchParams} totalPass={totalPass} />
      {selectedPass && (
        <>
          {/* <PassProfile open={viewModalOpen} onClose={() => setViewModalOpen(false)} Pass={selectedPass} onActionClick={handleActionClick} /> */}
          {/* <UpdatePass open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} Pass={selectedPass} fetchData={fetchData} /> */}
          {/* <CreateNewPass open={createNewPassModalOpen} onClose={() => setCreateNewPassModalOpen(false)} Pass={selectedPass} fetchData={fetchData} /> */}
        </>
      )}
    </div>
  );
};

export default Pass;

