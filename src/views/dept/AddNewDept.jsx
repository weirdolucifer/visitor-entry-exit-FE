import React, { useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import Notification from "../../components/notification";
import { url } from "../../utils/Constants";

const AddNewDept = ({ open, onClose, fetchData }) => {
  const initialValues = {
    name: '',
    extension: '',
  }

  const [userData, setUserData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!userData.name.trim()) newErrors.name = 'Name is required';
    if (!userData.extension.trim()) newErrors.extension = 'Extension is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: null }); // Clear errors
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const response = await fetch(`${url}/accounts/department/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        Notification.showSuccessMessage("Success", "Department Added Successfully");
        fetchData();
        setUserData(initialValues);
        handleClose();
      } else {
        const json = await response.json();
        let message = "";
        Object.values(json).forEach(value => {
          message += value[0] + "\n";
        });
        Notification.showErrorMessage("Error", message);
      }
    } catch (error) {
      Notification.showErrorMessage("Error", "Server error");
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
    setUserData(initialValues);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ className: "w-1/2 mx-auto my-8 p-8 overflow-hidden" }}
    >
      <div className="bg-white p-5">
        <DialogTitle as="h2" className="text-lg font-bold leading-6 text-gray-900 text-center">
          Add New Department
        </DialogTitle>
        <div className="px-4 py-5 sm:p-6">
          {/* User Form */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
            <input
              className={`border-2 p-3 rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              id="name"
              name="name"
              placeholder="Name"
              value={userData.name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}

            <label htmlFor="extension" className="text-sm font-medium text-gray-700">Extension</label>
            <input
              className={`border-2 p-3 rounded-lg ${errors.extension ? 'border-red-500' : 'border-gray-300'}`}
              id="extension"
              name="extension"
              placeholder="Extension"
              value={userData.extension}
              onChange={handleInputChange}
            />
            {errors.extension && <div className="text-red-500 text-xs">{errors.extension}</div>}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddNewDept;
