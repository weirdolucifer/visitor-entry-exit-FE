import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { url } from "../../utils/Constants.jsx";
import Notification from "../../components/notification/index.jsx";
import { UserContext } from "../../context/UserContext.jsx";

import Users from './Users';
import UserProfile from './UserProfile';
import UpdateUser from './UpdateUser';
import AddNewUser from './AddNewUser';
import CreateNewPass from '../pass/CreateNewPass';

const User = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [addNewUserModalOpen, setAddNewUserModalOpen] = useState(false);
  const [createNewPassModalOpen, setCreateNewPassModalOpen] = useState(false);

  const handleActionClick = (action, user = null) => {
    if (user) setSelectedUser(user);
    if (action === 'view') setViewModalOpen(true);
    if (action === 'update') setUpdateModalOpen(true);
    if (action === 'addNewUser') setAddNewUserModalOpen(true);
    if (action === 'pass') setCreateNewPassModalOpen(true);
  };

  let history = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name__icontains: '',
    phone__icontains: '',
    gov_id_no__icontains: '',
    offset: 0,
    limit: 10
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${url}/accounts/employee/?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setUserData(json.results);
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
      history("/login");
    }
    fetchData();
  }, []);

  return (
    <div style={{marginBottom:"55px"}}>
      {userData && (<Users users={userData} isLoading={isLoading} onActionClick={handleActionClick} />)}
      {selectedUser && (<>
        <UserProfile open={viewModalOpen} onClose={() => setViewModalOpen(false)} user={selectedUser} onActionClick={handleActionClick} />
        <UpdateUser open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} user={selectedUser} fetchData={fetchData} />
        <CreateNewPass open={createNewPassModalOpen} onClose={() => setCreateNewPassModalOpen(false)} visitor={selectedUser} employee={true} />
      </>
      )}
      <AddNewUser open={addNewUserModalOpen} onClose={() => setAddNewUserModalOpen(false)} fetchData={fetchData} />
    </div>
  );
};

export default User;
