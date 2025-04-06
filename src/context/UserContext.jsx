import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../components/notification";
import { url } from "../utils/Constants";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const [islogin, setIslogin] = useState(false);
  const [loggedUser, setLoggedUser] = useState();
  const navigate = useNavigate();

  return (
    <UserContext.Provider value={{
      isAuthenticated,
      user,
      setUser,
      username,
      setUsername,
      islogin,
      setIslogin,
      loggedUser,
      setLoggedUser
    }}>
      {children}
    </UserContext.Provider>
  );
}
