import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Notification from '../../components/notification';
import { url } from '../../utils/Constants';

const CreateNewVisitLog = ({ open, onClose, pass }) => {

    const now = new Date();

    // Extract the date and time components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1 and pad
    const day = String(now.getDate()).padStart(2, '0'); // Pad single digits
    const hours = String(now.getHours()).padStart(2, '0'); // Pad single digits
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Pad single digits
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Pad single digits

    // Construct the datetime string in the desired format (YYYY-MM-DDTHH:mm:ss)
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    const initialValues = {
        pass_id: pass?.id,
        purpose_of_visit: '',
        in_datetime: formattedDate,
        token_no: '',
        submitted_devices: '',
        carried_devices: '',
        vehicle_details: '',
        whom_to_visit: null,
        visiting_department: null,
        escorted_by: null,
    };

    const steps = ['Visit Details', 'Device Info', 'Department/Employee Info'];
    const [visitLogData, setVisitLogData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [employeeList, setEmployeeList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);

    useEffect(() => {
        // Fetch employee and department lists
        fetchEmployeeList();
        fetchDepartmentList();
    }, []);

    useEffect(() => {
        setVisitLogData((currentData) => ({
            ...currentData,
            pass: pass?.id,
        }));
    }, [pass]);

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
                setEmployeeList(json.map((employee) => ({ id: employee.id, name: employee.name })));
            } else {
                Notification.showErrorMessage('Try Again!', json.error);
            }
        } catch (err) {
            Notification.showErrorMessage('Error', 'Server error!');
        }
    };

    const fetchDepartmentList = async () => {
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
                setDepartmentList(json.map((department) => ({ id: department.id, name: department.name })));
            } else {
                Notification.showErrorMessage('Try Again!', json.error);
            }
        } catch (err) {
            Notification.showErrorMessage('Error', 'Server error!');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVisitLogData({ ...visitLogData, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    const validate = () => {
        let newErrors = {};
        if (activeStep === 0) {
            if (!String(visitLogData.pass).trim()) newErrors.pass = 'Pass no. is required';
            if (!visitLogData.purpose_of_visit.trim()) newErrors.purpose_of_visit = 'Purpose of visit is required';
            if (!visitLogData.in_datetime.trim()) newErrors.in_datetime = 'In Date Time is required';
        }
        if (activeStep === 2) {
            if (!visitLogData.whom_to_visit && !visitLogData.visiting_department) newErrors.whom_to_visit = 'Either employee or department must be selected';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            if (activeStep < steps.length - 1) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(prevActiveStep => prevActiveStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const response = await fetch(`${url}/passes/visit-log/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(visitLogData),
            });

            const json = await response.json();

            if (response.ok) {
                Notification.showSuccessMessage('Success', 'Visit Log created successfully');
                setVisitLogData(initialValues);
                handleClose();
            }
            else {
                Notification.showErrorMessage('Error', json);
            }
        } catch (error) {
            Notification.showErrorMessage('Errors', 'Server error');
        }
    };

    const handleClose = () => {
        onClose();
        setActiveStep(0);
        setErrors({});
        setVisitLogData(initialValues);
    };

    const stepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="pass" className="text-sm font-medium text-gray-700">Pass No.</label>
                        <input
                            type="text"
                            id="pass"
                            name="pass"
                            placeholder="Pass No."
                            value={visitLogData.pass}
                            disabled
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.pass ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.pass && <div className="text-red-500 text-xs">{errors.pass}</div>}

                        <label htmlFor="purpose_of_visit" className="text-sm font-medium text-gray-700">Purpose of Visit</label>
                        <input
                            type="text"
                            id="purpose_of_visit"
                            name="purpose_of_visit"
                            placeholder="Purpose of visit"
                            value={visitLogData.purpose_of_visit}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.purpose_of_visit ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.purpose_of_visit && <div className="text-red-500 text-xs">{errors.purpose_of_visit}</div>}

                        <label htmlFor="in_datetime" className="text-sm font-medium text-gray-700">
                            In Date Time
                        </label>
                        <input
                            type="text"
                            id="in_datetime"
                            name="in_datetime"
                            placeholder="In Date Time"
                            value={visitLogData.in_datetime}
                            disabled
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.in_datetime ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.in_datetime && <div className="text-red-500 text-xs">{errors.in_datetime}</div>}
                    </div>
                );
            case 1:
                return (
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="token_no" className="text-sm font-medium text-gray-700">Token Number</label>
                        <input
                            type="text"
                            id="token_no"
                            name="token_no"
                            placeholder="Token number"
                            value={visitLogData.token_no}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.token_no ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.token_no && <div className="text-red-500 text-xs">{errors.token_no}</div>}
                        <label htmlFor="submitted_devices" className="text-sm font-medium text-gray-700">Submitted Devices</label>
                        <textarea
                            id="submitted_devices"
                            name="submitted_devices"
                            placeholder="Devices submitted"
                            value={visitLogData.submitted_devices}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.submitted_devices ? 'border-red-500' : 'border-gray-300'}`}
                        ></textarea>
                        {errors.submitted_devices && <div className="text-red-500 text-xs">{errors.submitted_devices}</div>}

                        <label htmlFor="carried_devices" className="text-sm font-medium text-gray-700">Carried Devices</label>
                        <textarea
                            type="text"
                            id="carried_devices"
                            name="carried_devices"
                            placeholder="Devices carried"
                            value={visitLogData.carried_devices}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.carried_devices ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.carried_devices && <div className="text-red-500 text-xs">{errors.carried_devices}</div>}

                        <label htmlFor="vehicle_details" className="text-sm font-medium text-gray-700">Vehicle Details</label>
                        <textarea
                            type="text"
                            id="vehicle_details"
                            name="vehicle_details"
                            placeholder="Vehicle details"
                            value={visitLogData.vehicle_details}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.vehicle_details ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.vehicle_details && <div className="text-red-500 text-xs">{errors.vehicle_details}</div>}
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="whom_to_visit" className="text-sm font-medium text-gray-700">Whom to Visit</label>
                        <select
                            id="whom_to_visit"
                            name="whom_to_visit"
                            value={visitLogData.whom_to_visit || ''}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.whom_to_visit ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Employee</option>
                            {employeeList.map((employee) => (
                                <option key={employee.id} value={employee.id}>{employee.name}</option>
                            ))}
                        </select>
                        {errors.whom_to_visit && <div className="text-red-500 text-xs">{errors.whom_to_visit}</div>}

                        <label htmlFor="visiting_department" className="text-sm font-medium text-gray-700">Visiting Department</label>
                        <select
                            id="visiting_department"
                            name="visiting_department"
                            value={visitLogData.visiting_department || ''}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.visiting_department ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Department</option>
                            {departmentList.map((department) => (
                                <option key={department.id} value={department.id}>{department.name}</option>
                            ))}
                        </select>
                        {errors.visiting_department && <div className="text-red-500 text-xs">{errors.visiting_department}</div>}

                        <label htmlFor="escorted_by" className="text-sm font-medium text-gray-700">Escorted By</label>
                        <select
                            id="escorted_by"
                            name="escorted_by"
                            value={visitLogData.escorted_by || ''}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.escorted_by ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Employee</option>
                            {employeeList.map((employee) => (
                                <option key={employee.id} value={employee.id}>{employee.name}</option>
                            ))}
                        </select>
                        {errors.escorted_by && <div className="text-red-500 text-xs">{errors.escorted_by}</div>}
                    </div>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ className: "w-1/2 mx-auto my-8 p-8 overflow-hidden" }}>
                <DialogTitle as="h2" className="text-lg font-bold leading-6 text-gray-900 text-center">
                    Create New Visit Log
                </DialogTitle>
                <div className="flex items-center justify-between p-3">
                    {steps.map((label, index) => (
                        <div key={label} className={`flex-1 ${index <= activeStep ? "bg-green-500" : "bg-gray-200"} h-2 mx-2 rounded-full`} />
                    ))}
                </div>
                <div className="px-4 py-5 sm:p-6">
                    {stepContent(activeStep)}
                    <div className="flex justify-between mt-8">
                        <button className={`py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${activeStep === 0 ? "bg-gray-300" : "bg-red-500"}`} disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </button>
                        {activeStep === steps.length - 1 ? (
                            <button className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500" onClick={handleSubmit}>
                                Submit
                            </button>
                        ) : (
                            <button className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500" onClick={handleNext}>
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default CreateNewVisitLog;
