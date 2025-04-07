import React from 'react';
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';

const ViewVisitLog = ({ open, onClose, visitlogData }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={true}
            maxWidth="lg"
            className="flex justify-center items-center"
        >
            <Paper className="bg-white p-4 printableArea shadow-md w-full" style={{ width: '600px', height: 'auto' }}> {/* Reduce width to 600px */}
                <div className="grid gap-4 items-start border-2 border-gray-300 rounded-lg shadow-sm">
                    {/* Details section starts here */}
                    <div className="col-span-1 flex flex-col space-y-4 p-2">
                        <div className="flex justify-center p-2">
                            <h1 className="text-xl font-bold">Visit Details</h1>
                        </div>
                        <div className="flex flex-wrap">
                            <div className="w-full md:w-1/2 p-2">
                                <InfoItem label="Name" value={`${visitlogData?.visitor_name || visitlogData.employee_name}`} />
                                <InfoItem label="Pass Type" value={visitlogData?.pass_type} />
                                <InfoItem label="Pass ID" value={visitlogData?.pass_id} />
                                <InfoItem label="Purpose of Visit" value={visitlogData?.purpose_of_visit} />
                            </div>
                            <div className="w-full md:w-1/2 p-2 flex items-center justify-center">
                                {visitlogData?.visitor_image ? (
                                    <img
                                        src={`data:image/jpeg;base64,${visitlogData?.visitor_image}`}
                                        alt="Visitor"
                                        className="h-24 w-24 border-2 border-gray-300 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="h-24 w-24 border-2 border-gray-300 flex items-center justify-center text-white bg-customGreen rounded-xl">
                                        {visitlogData.visitor_name ? visitlogData.visitor_name.charAt(0).toUpperCase() : 'N/A'}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap">
                            <div className="w-full p-2">
                                <InfoItem label="Token No" value={visitlogData?.token_no} />
                                <InfoItem label="Submitted Devices" value={visitlogData?.submitted_devices} />
                                <InfoItem label="Carried Devices" value={visitlogData?.carried_devices} />
                                <InfoItem label="Vehicle Details" value={visitlogData?.vehicle_details} />
                            </div>
                        </div>

                        <div className="flex flex-wrap">
                            <div className="w-full p-2">
                                <InfoItem label="In Time" value={new Date(visitlogData?.in_datetime).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })} />
                                <InfoItem label="Out Time" value={visitlogData.out_datetime? new Date(visitlogData.out_datetime).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }): ''} />
                                <InfoItem label="Whom to Visit / Visiting Department" value={visitlogData?.whom_to_visit_name || visitlogData?.visiting_department_name || 'N/A'} />
                                <InfoItem label="Escorted By" value={visitlogData?.escorted_by_name || 'N/A'} />
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        </Dialog>
    );
};

const InfoItem = ({ label, value }) => (
    <div className="flex items-center space-x-2 mb-2">
        <span className="font-semibold">{label}:</span>
        <span>{value}</span>
    </div>
);

export default ViewVisitLog;
