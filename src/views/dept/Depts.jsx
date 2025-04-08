import React, { useState, useEffect } from "react";
import { Box, CircularProgress, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Select, FormControl, InputLabel } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Alert from "../../components/alert/index.jsx";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Pagination from "../../components/pagination/index.jsx";

const Depts = ({ users, isLoading, onActionClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = users?.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handlePageSizeChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setCurrentSelectedUser(user);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (user) => {
    setCurrentSelectedUser(user);
    setShowDeleteAlert(true);
    handleClose();
  };

  const confirmDelete = () => {
    console.log("Deleting user:", currentSelectedUser);
    setShowDeleteAlert(false);
    // Perform delete action here
  };

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center m-6">
        <div className="flex items-center space-x-2">
            <input
              className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
              type="text"
              placeholder="Search Department Name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <select
              value={itemsPerPage}
              onChange={handlePageSizeChange}
              className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
            >
              {[5, 10, 20, 30, 50].map(size => (
                <option key={size} value={size}>{size} per page</option>
              ))}
            </select>
        </div>
        <button
            className="flex items-center bg-customGreen hover:bg-green-700 text-white py-1 px-4 rounded-3xl"
            onClick={() => onActionClick('addNewUser')}
          >
            <AddIcon className="h-4 w-5 mr-2" />
            Add New
        </button>
      </div>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : currentUsers?.length > 0 ? (
        <div className="bg-white shadow-md rounded my-6">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light text-center">
                  Department ID
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Department Name
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Extension
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers?.map((user, index) => (
                <tr key={index} className="hover:bg-grey-lighter">
                  <td className="py-4 px-6 border-b border-grey-light text-center">
                    {user.id}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {user.name}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {user.extension}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, user)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => { onActionClick('update', currentSelectedUser); handleClose(); }}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Update" />
                      </MenuItem>
                      <MenuItem onClick={() => { handleDelete(currentSelectedUser) }}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Delete" />
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage} />
        </div>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', textAlign: 'center' }}>
          <p>No Department found.</p>
        </Box>
      )}
      <Alert
        open={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        buttonText="Delete"
        buttonColor="red"
        onButtonClick={confirmDelete}
      />
    </div>
  );
};

export default Depts;

