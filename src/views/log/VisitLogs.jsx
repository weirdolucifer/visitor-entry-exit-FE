import React, { useState, useEffect } from "react";
import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from '@mui/icons-material/Event';
import Alert from "../../components/alert/index.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "../../components/pagination/index.jsx";
import ViewVisitLog from "./ViewVisitLog.jsx";
import { url } from "../../utils/Constants.jsx";


const VisitLogs = ({ VisitLog, totalVisitLog, isLoading, onActionClick, searchParams, setSearchParams }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSelectedVisitLog, setCurrentSelectedVisitLog] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showViewVisitLog, setShowViewVisitLog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const fetchEmployeeList = async () => {
    try {
        const response = await fetch(`${url}/accounts/employee/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const json = await response.json();
        if (response.ok) {
            setEmployeeList(json.map(employee => ({ id: employee.id, name: employee.name })));
        } else {
            Notification.showErrorMessage('Try Again!', json.error);
        }
    } catch (err) {
        Notification.showErrorMessage('Error', 'Server error!');
    }
  };

  const fetchDepartmentist = async () => {
    try {
        const response = await fetch(`${url}/accounts/department/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const json = await response.json();
        if (response.ok) {
            setDepartmentList(json.map(department => ({ id: department.id, name: department.name })));
        } else {
            Notification.showErrorMessage('Try Again!', json.error);
        }
    } catch (err) {
        Notification.showErrorMessage('Error', 'Server error!');
    }
  };

  const handleClick = (event, visitLog) => {
    setAnchorEl(event.currentTarget);
    setCurrentSelectedVisitLog(visitLog);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (visitLog) => {
    setCurrentSelectedVisitLog(visitLog);
    setShowDeleteAlert(true);
    handleClose();
  };

  const confirmDelete = () => {
    console.log("Deleting...");
    console.log(currentSelectedVisitLog);
    setShowDeleteAlert(false);
    // Perform delete action
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    const newName = `${name}`;
    setSearchParams({ ...searchParams, [newName]: value });
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

  useEffect(() => {
    fetchEmployeeList();
    fetchDepartmentist();
  }, []);

  const totalPages = Math.ceil(totalVisitLog / itemsPerPage);

  return (
    <div style={{marginBottom:"55px"}}>
      <div className="flex justify-between items-center m-6">
        <div className="flex items-center space-x-2 w-full">
          {/* Visitor Name Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="visitor_name"
              className="text-sm font-medium text-gray-700 mb-2 ml-2"
            >
              Visitor Name
            </label>
            <input
              className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
              type="text"
              name="visitor_name"
              value={searchParams.visitor_name}
              onChange={handleSearchChange}
              placeholder="Search by name"
            />
          </div>

          {/* Pass Type Filter */}
          <div className="flex flex-col w-1/4">
            <label
              htmlFor="pass_type"
              className="text-sm font-medium text-gray-700 mb-2 ml-2"
            >
              Pass Type
            </label>
            <select
              value={searchParams.pass_type || ""}
              onChange={handleSearchChange}
              name="pass_type"
              className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
            >
              <option value="">Select</option>
              {Object.keys(passTypes).map((key) => (
                <option key={key} value={key}>
                  {passTypes[key]}
                </option>
              ))}
            </select>
          </div>

          {/* Limit Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="limit"
              className="text-sm font-medium text-gray-700 mb-2 ml-2"
            >
              Results per page
            </label>
            <select
              value={searchParams.limit}
              onChange={handleLimitChange}
              name="limit"
              className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
            >
              {[5, 10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-6 w-full ml-4">
          {/* In Date Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="in_date"
              className="text-sm font-medium text-gray-700 mb-2 ml-4"
            >
              &gt;= In Date
            </label>
            <input
              type="date"
              id="in_date"
              name="in_date"
              value={searchParams.in_date}
              onChange={handleSearchChange}
              className="border border-customGreen rounded-3xl py-2 px-3 text-gray-700 focus:outline-none"
            />
          </div>

          {/* Out Date Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="out_date"
              className="text-sm font-medium text-gray-700 mb-2 ml-4"
            >
              &lt; Out Date
            </label>
            <input
              type="date"
              id="out_date"
              name="out_date"
              value={searchParams.out_date}
              onChange={handleSearchChange}
              className="border border-customGreen rounded-3xl py-2 px-3 text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center m-6">
        <div className="flex items-center space-x-2 w-full">
          {/* Employee (Whom to Visit) */}
          <div className="flex flex-col w-1/4">
            <label
              htmlFor="whom_to_visit"
              className="text-sm font-medium text-gray-700 mb-2 ml-4"
            >
              Whom to Visit
            </label>
            <select
              value={searchParams.whom_to_visit || ""}
              onChange={handleSearchChange}
              name="whom_to_visit"
              className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
            >
              <option value="">Select Employee</option>
              {employeeList.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee (Escorted By) */}
          <div className="flex flex-col w-1/4">
            <label
              htmlFor="escorted_by"
              className="text-sm font-medium text-gray-700 mb-2 ml-4"
            >
              Escorted By
            </label>
            <select
              value={searchParams.escorted_by || ""}
              onChange={handleSearchChange}
              name="escorted_by"
              className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
            >
              <option value="">Select Employee</option>
              {employeeList.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department (Visiting Department) */}
          <div className="flex flex-col w-1/4">
            <label
              htmlFor="visiting_department"
              className="text-sm font-medium text-gray-700 mb-2 ml-4"
            >
              Visiting Department
            </label>
            <select
              value={searchParams.visiting_department || ""}
              onChange={handleSearchChange}
              name="visiting_department"
              className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
            >
              <option value="">Select Department</option>
              {departmentList.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
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
      ) : VisitLog?.length > 0 ? (
        <div className="bg-white shadow-md rounded my-6">
          <table className="text-left w-full border-collapse">
              <thead>
                  <tr>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light text-center">Profile</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Visitor/Employee Name</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Pass No.</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Pass Type</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">In Time</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Out Time</th>
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Purpose of Visit</th>
                  </tr>
              </thead>
              <tbody>
                {VisitLog.map((visitlog, index) => {
                  const rowClass = isToday(visitlog.in_datetime) ? "bg-yellow-200" : "";
                  const shouldShowExitLogMenu = !visitlog.out_datetime;

                  return (
                    <tr key={index} className={`hover:bg-grey-lighter cursor-pointer ${rowClass}`}>
                      <td className="py-1 px-1 border-b border-grey-light">
                        <div className="flex justify-center">
                          <div className="inline-block h-16 w-16 border-2 border-gray-300 rounded-full overflow-hidden bg-customGreen">
                            {visitlog.visitor_image ? (
                              <img src={`data:image/jpeg;base64,${visitlog.visitor_image}`} alt="Visitor Image" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-white bg-customGreen">
                                {visitlog.visitor_name ? visitlog.visitor_name.charAt(0).toUpperCase() : 'N/A'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">{visitlog.visitor_name || visitlog.employee_name}</td>
                      <td className="py-4 px-6 border-b border-grey-light">{visitlog.pass_id}</td>
                      <td className="py-4 px-6 border-b border-grey-light">{passTypes[visitlog.pass_type] || visitlog.pass_type}</td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {new Date(visitlog.in_datetime).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {visitlog.out_datetime? new Date(visitlog.out_datetime).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }): ''}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">{visitlog.purpose_of_visit}</td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        <IconButton
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(event) => handleClick(event, visitlog)}
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
                          <MenuItem onClick={() => { onActionClick('view', currentSelectedVisitLog); setShowViewVisitLog(true); handleClose(); }}>
                            <ListItemIcon>
                              <VisibilityIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="View Visit Details" />
                          </MenuItem>
                          <MenuItem
                            onClick={() => { 
                              onActionClick('update', currentSelectedVisitLog);
                              handleClose(); 
                            }}
                          >
                            <ListItemIcon>
                              <EventIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Log Exit" />
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
          <p>No VisitLog found.</p>
        </Box>
      )}
      {currentSelectedVisitLog && <ViewVisitLog visitlogData={currentSelectedVisitLog} open={showViewVisitLog} onClose={() => setShowViewVisitLog(false)} />}
      <Alert
        open={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this VisitLog?"
        buttonText="Delete"
        buttonColor="red"
        onButtonClick={confirmDelete}
      />
    </div>
  );
};

export default VisitLogs;