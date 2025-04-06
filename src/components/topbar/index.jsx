import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import Notification from "../../components/notification";
import essilogo from "../../assets/images/essi-logo.png";
import Profile from "../../views/auth/Profile.jsx";
import { url } from "../../utils/Constants";

const Topbar = () => {
  let history = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { setIslogin, setUser, user, setDatas } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${url}/accounts/logout-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          refresh: localStorage.getItem("refresh_token"),
        }),
      });
      if (response.ok) {
        localStorage.clear();
        setUser();
        history("/login");
        Notification.showSuccessMessage(
          "Logout Successfully!",
          "You have been logged out successfully."
        );
      }
    } catch (err) {
      Notification.showErrorMessage("Error", "Server error!");
    }
  };

  let username = localStorage.getItem("user_name");
  let userimage = localStorage.getItem("image");

  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const capitalizedUsername = capitalizeFirstLetter(username);

  useEffect(() => {
    username = localStorage.getItem("user_name");
    userimage = localStorage.getItem("image");
  });

  return (
    <>
      <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
        {/* <img src={essilogo} alt="MOD Logo" className="h-12" /> */}
        <div class="h-full flex items-center font-bold text-xl">
          Visitor Management System
        </div>

        {localStorage.getItem("token") && (
          <div className="flex items-center space-x-2">
            <div
              className="flex items-center space-x-2 bg-customGreen rounded-full p-1 transform scale-90 shadow-md min-w-[150px]"
            >
              <span className="text-white p-1 mx-2">Welcome {capitalizedUsername}</span>
            </div>

            <button
              className="bg-customGreen hover:bg-green-700 text-white py-2 px-4 rounded-3xl shadow-md flex items-center text-sm"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default Topbar;
