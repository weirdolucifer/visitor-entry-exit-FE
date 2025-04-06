import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Notification from '../../components/notification';
import { url } from '../../utils/Constants';
import Select from 'react-select';
import ViewPass from "./ViewPass";
import CameraModal from "../../components/camera";
import MultipleSelectDropdown from './MultipleSelectDropdown';

const CreateNewPass = ({ open, onClose, visitor }) => {
    const initialValues = {
        visitor: visitor.id,
        validity: '',
        pass_type: '',
        pass_image: '',
    };

    const steps = ['Pass Details', 'Zone Access'];
    const [passData, setPassData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [isConflict, setIsConflict] = useState(false);
    const [previousVisitor, setPreviousVisitor] = useState({});
    const [showViewPass, setShowViewPass] = useState(false);
    const [passCreated, setPassCreated] = useState({});
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageData, setImageData] = useState('');

    useEffect(() => {
        setPassData(currentData => ({
            ...currentData,
            visitor: visitor?.id,
        }));
    }, [visitor]);

    useEffect(() => {
        if (!passData.validity) {
            const currentDate = new Date().toISOString().split('T')[0];
            setPassData((prevData) => ({
                ...prevData,
                validity: currentDate,
            }));
        }
    }, [passData.validity]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        let updatedValue = value;
        
        if (name === "validity") {
            if (value) {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    updatedValue = `${value}T18:00`;
                } else {
                    updatedValue = '';
                    setErrors({ ...errors, [name]: 'Invalid date format' });
                }
            } else {
                updatedValue = '';
            }
        }
        setPassData({ ...passData, [name]: updatedValue });
        setErrors({ ...errors, [name]: null });
    };

    const validate = () => {
        let newErrors = {};
        if (activeStep === 0) {
            if (!String(passData.visitor).trim()) newErrors.visitor = 'Visitor ID is required';
            if (!passData.pass_type.trim()) newErrors.pass_type = 'Pass Type is required';
            if (!passData.validity.trim()) newErrors.validity = 'Validity is required';
            if (!passData.local_pass_id) newErrors.local_pass_id = 'Local Pass ID is required';
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
            passData.pass_image = imageData;
            const response = await fetch(`${url}/passes/pass-info/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(passData),
            });

            const json = await response.json();

            if (response.ok) {
                Notification.showSuccessMessage('Success', 'Pass created successfully');
                setPassCreated(json);
                setShowViewPass(true);
                setPassData(initialValues);
                handleClose();
            } else {
                if (response.status === 409);
                {
                    const response = await fetch(`${url}/passes/view-last-registered-visitor/${passData?.key}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const json = await response.json();
                    if (response.ok) {
                        setPreviousVisitor(json);
                        setIsConflict(true);
                    } else {
                        Notification.showErrorMessage('Try Again!', json.error);
                    }
                }
            }
        } catch (error) {
            Notification.showErrorMessage('Errors', 'Server error');
        }
    };

    const handleImageCapture = (base64Image) => {
        setImageData(base64Image);
        setImageModalOpen(false);
      };

    const handleOverWriteSubmit = async () => {
        if (!validate()) return;
        try {
            const response = await fetch(`${url}/passes/visitor-pass-info/overwrite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(passData),
            });
            const json = await response.json();

            if (response.ok) {
                Notification.showSuccessMessage('Success', 'Pass created successfully');
                setPassCreated(json);
                setShowViewPass(true);
                setPassData(initialValues);
                handleClose();
                setIsConflict(false);
            } else {
                Notification.showErrorMessage('Error', 'Unable To OverWrite Pass');
            }
        } catch (error) {
            Notification.showErrorMessage('Error', 'Server error');
        }
    };

    const handleClose = () => {
        onClose();
        setActiveStep(0);
        setErrors({});
        setSelectedZones([]);
        setPassData(initialValues);
    };

    const [selectedZones, setSelectedZones] = useState([]);

    const stepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="visitor" className="text-sm font-medium text-gray-700">
                            Visitor ID
                        </label>
                        <input
                            type="text"
                            id="visitor"
                            name="visitor"
                            placeholder="Visitor ID"
                            value={passData.visitor}
                            onChange={handleInputChange}
                            disabled
                            className={`border-2 p-3 rounded-lg ${errors.visitor ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.visitor && <div className="text-red-500 text-xs">{errors.visitor}</div>}
                        
                        <label htmlFor="visiting_department" className="text-sm font-medium text-gray-700">
                            Pass Type
                        </label>
                        <select
                            id="pass_type"
                            name="pass_type"
                            value={passData.pass_type}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.pass_type ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Pass Type</option>
                            <option value="visitor">Visitor</option>
                            <option value="foreigner_visitor">Visitor (Foreigner)</option>
                            <option value="work_pass">Work Pass</option>
                            <option value="na">Not Applicable</option>
                        </select>
                        {errors.pass_type && <div className="text-red-500 text-xs">{errors.pass_type}</div>}

                        <label htmlFor="validity" className="text-sm font-medium text-gray-700">
                            Valid Until
                        </label>
                        <input
                            type="date"
                            id="validity"
                            name="validity"
                            value={passData.validity}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.validity ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.validity && <div className="text-red-500 text-xs">{errors.validity}</div>}

                        <label htmlFor="local_pass_id" className="text-sm font-medium text-gray-700">
                            Local Pass ID
                        </label>
                        <input
                            type="text"
                            id="local_pass_id"
                            name="local_pass_id"
                            placeholder="Local Pass ID"
                            value={passData.local_pass_id}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.local_pass_id ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.local_pass_id && <div className="text-red-500 text-xs">{errors.local_pass_id}</div>}
                    </div>
                );
            case 1:
                return (
                    <div className="flex justify-center items-center p-4">
                    <div className="space-y-4 flex flex-col items-center">
                        <label htmlFor="image" className="text-sm font-semibold text-gray-700">Pass Image</label>
                        <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center justify-center relative" style={{ width: '200px', height: '200px' }}>
                        {imageData ? (
                            <img src={`data:image/jpeg;base64,${imageData}`} alt="Captured Image" className="max-h-full max-w-full rounded" />
                        ) : (
                            <span className="text-gray-500">No image captured</span>
                        )}
                        </div>
                        <button className="flex items-center bg-customGreen hover:bg-green-700 text-white py-1 px-4 rounded-3xl" onClick={() => setImageModalOpen(true)}>
                        Capture Pass Image
                        </button>
                        <CameraModal open={imageModalOpen} onClose={() => setImageModalOpen(false)} onCaptured={handleImageCapture} />
                    </div>
                    </div>
        
                );
            default:
                return 'Unknown step';
        }
    };

    const handleCancel = () => {
        setActiveStep(1);
        setIsConflict(false);
    };

    const conflictDialog = (
        <Dialog open={isConflict}
            onClose={handleCancel}
            fullWidth
            maxWidth="sm"
            PaperProps={{ className: "w-1/2 overflow-hidden" }}
        >
            <DialogTitle
                as="h2"
                className="text-lg font-bold leading-6 p-2 text-gray-900 text-center"
            >
                Conflict Detected
            </DialogTitle>
            {/* <div className="flex flex-col items-center justify-between p-3"> */}
            <DialogContent className="p-4 text-center">
                <div className="flex justify-center">
                    <div className="inline-block h-48 w-48 border-2 border-gray-300 rounded-full overflow-hidden bg-customGreen">
                        {previousVisitor.image ? (
                            <img
                                src={`data:image/jpeg;base64,${previousVisitor.image}`}
                                alt="Visitor"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-white bg-customGreen">
                                {previousVisitor.first_name
                                    ? previousVisitor.first_name.charAt(0).toUpperCase()
                                    : "N"}
                            </div>
                        )}
                    </div>
                </div>
                <p className="mt-2">Name: {previousVisitor.first_name} {previousVisitor.last_name}</p>
                <p className="mt-2">Pass created on:                 {new Date(previousVisitor?.created_on).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            </DialogContent>
            <DialogActions className="flex justify-evenly p-4 border-t">
                <button
                    className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button
                    className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={handleOverWriteSubmit}
                >
                    Continue
                </button>
            </DialogActions>
            {/* </div> */}
        </Dialog>
    );

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{ className: "w-1/2 mx-auto my-8 p-8 overflow-hidden" }}
            >
                <DialogTitle
                    as="h2"
                    className="text-lg font-bold leading-6 text-gray-900 text-center"
                >
                    Create New Pass
                </DialogTitle>
                <div className="flex items-center justify-between p-3">
                    {steps.map((label, index) => (
                        <div
                            key={label}
                            className={`flex-1 ${index <= activeStep ? "bg-green-500" : "bg-gray-200"
                                } h-2 mx-2 rounded-full transition duration-500 ease-in-out`}
                        ></div>
                    ))}
                </div>
                <div className="px-4 py-5 sm:p-6">
                    {stepContent(activeStep)}
                    <div className="flex justify-between mt-8">
                        <button
                            className={`py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${activeStep === 0 ? "bg-gray-300" : "bg-red-500 hover:bg-red-700"
                                }`}
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Back
                        </button>
                        {activeStep === steps.length - 1 ? (
                            <button
                                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-700"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </Dialog>
            {isConflict && conflictDialog}
            {passCreated?.visitor && <ViewPass passData={passCreated} open={showViewPass} onClose={() => setShowViewPass(false)} />}
        </>
    );
};

export default CreateNewPass;
