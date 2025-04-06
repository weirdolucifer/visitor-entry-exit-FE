import React, { useState, useEffect } from "react";
import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Alert from "../../components/alert/index.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "../../components/pagination/index.jsx";
import ViewPass from "./ViewPass.jsx";


const Passes = ({ Pass, totalPass, isLoading, onActionClick, searchParams, setSearchParams }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSelectedPass, setCurrentSelectedPass] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showViewPass, setShowViewPass] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);



  const handleClick = (event, Pass) => {
    setAnchorEl(event.currentTarget);
    setCurrentSelectedPass(Pass);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (Pass) => {
    setCurrentSelectedPass(Pass);
    setShowDeleteAlert(true);
    handleClose();
  };

  const confirmDelete = () => {
    console.log("Deleting...");
    console.log(currentSelectedPass);
    setShowDeleteAlert(false);
    // Perform delete action
  };
  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    const newName = `${name}`;
    if (newName === 'active' && value === '') {
        const { active, ...rest } = searchParams;
        setSearchParams(rest);
    } else {
        setSearchParams({ ...searchParams, [newName]: value });
    }
    setCurrentPage(1);
};

  const handleLimitChange = (event) => {
    setSearchParams({ ...searchParams, limit: event.target.value, offset: 0 });
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (offset) => {
    setSearchParams({ ...searchParams, offset });
  };

  const passTypes = {
    "visitor": "Visitor",
    "emp_work_pass": "Work Pass (Employee)",
    "emp_daily_pass": "Daily Pass",
    "emp_temp_veh_pass": "Temporary Vehicle Pass",
    "foreigner_visitor": "Visitor (Foreigner)",
    "work_pass": "Work Pass",
    "na": "Not Applicable"
  };

  const isToday = (date) => {
    const today = new Date();
    const passedDate = new Date(date);
    return passedDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];
  };

  useEffect(() => {
    handlePageChange((currentPage - 1) * itemsPerPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalPass / itemsPerPage);

  return (
    <div style={{marginBottom:"55px"}}>
      <div className="flex justify-between items-center m-6">
        <div className="flex items-center space-x-2">
          <input
            className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
            type="text"
            name="visitor_name"
            value={searchParams.visitor_name}
            onChange={handleSearchChange}
            placeholder="Search by visitor name"
          />
          <select
            value={searchParams.pass_type || ""}
            onChange={handleSearchChange}
            name="pass_type"
            className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
          >
            <option value="">Select Pass Type</option>
            {Object.keys(passTypes).map((key) => (
              <option key={key} value={key}>
                {passTypes[key]}
              </option>
            ))}
          </select>

          <select
            value={searchParams.active || ""}
            onChange={handleSearchChange}
            name="active"
            className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
          >
            <option key="active" value="true">Active</option>
            <option key="active" value="false">Expired</option>
            <option key="" value="">All</option>
          </select>
          <select
            value={searchParams.limit}
            onChange={handleLimitChange}
            className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
          >
            {[5, 10, 20, 30, 50].map(size => (
              <option key={size} value={size}>{size} per page</option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <Box
          style={{
            height: "50vh",
            minHeight: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : Pass?.length > 0 ? (
        <div className="bg-white shadow-md rounded my-6">
          <table className="text-left w-full border-collapse">
              <thead>
                  <tr>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light text-center">Profile</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Visitor/Employee Name</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Pass No.</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Pass Type</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Local Pass No.</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Validity</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Actions</th>
                  </tr>
              </thead>
              <tbody>{Pass.map((pass, index) => {
                const rowClass = isToday(pass.validity) ? "bg-yellow-200" : "";

                return (
                  <tr key={index} className={`hover:bg-grey-lighter cursor-pointer ${rowClass}`}>
                    <td className="py-1 px-1 border-b border-grey-light">
                      <div className="flex justify-center">
                        <div className="inline-block h-16 w-16 border-2 border-gray-300 rounded-full overflow-hidden bg-customGreen">
                          {pass.visitor_image ? (
                            <img src={`data:image/jpeg;base64,${pass.visitor_image}`} alt="Visitor Image" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-white bg-customGreen">
                              {pass.visitor_name ? pass.visitor_name.charAt(0).toUpperCase() : 'N/A'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">{pass.visitor_name || pass.employee_name}</td>
                    <td className="py-4 px-6 border-b border-grey-light">{pass.id}</td>
                    <td className="py-4 px-6 border-b border-grey-light">{passTypes[pass.pass_type] || pass.pass_type}</td>
                    <td className="py-4 px-6 border-b border-grey-light">{pass.local_pass_id}</td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {new Date(pass.validity).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, pass)}
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
                        <MenuItem onClick={() => { onActionClick('view', currentSelectedPass); setShowViewPass(true); handleClose(); }}>
                          <ListItemIcon>
                            <VisibilityIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="View / Print Pass" />
                        </MenuItem>
                        <MenuItem onClick={() => { onActionClick('log', currentSelectedPass); handleClose(); }}>
                          <ListItemIcon>
                            <EditIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Log Visit" />
                        </MenuItem>
                      </Menu>
                    </td>
                  </tr>
                );
              })}
              </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage} />
        </div>) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', textAlign: 'center' }}>
          <p>No Pass found.</p>
        </Box>
      )}
      {currentSelectedPass && <ViewPass passData={currentSelectedPass} open={showViewPass} onClose={() => setShowViewPass(false)} />}
      <Alert
        open={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this Pass?"
        buttonText="Delete"
        buttonColor="red"
        onButtonClick={confirmDelete}
      />
    </div>
  );
};

export default Passes;