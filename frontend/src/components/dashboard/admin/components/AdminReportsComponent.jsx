import React from 'react';
import { FaFileAlt, FaDownload } from 'react-icons/fa';

const ReportItem = ({ title, date, downloadUrl }) => (
  <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg mb-2">
    <div className="flex items-center">
      <FaFileAlt className="text-primary mr-3" />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
    <a href={downloadUrl} className="btn btn-sm btn-outline btn-primary">
      <FaDownload className="mr-2" /> Download
    </a>
  </div>
);

const AdminReportsComponent = ({ data }) => {
  const dummyReports = [
    { id: 1, title: 'Monthly User Activity', date: '2023-08-01', downloadUrl: '#' },
    { id: 2, title: 'Service Utilization Q2', date: '2023-07-15', downloadUrl: '#' },
    { id: 3, title: 'Financial Summary', date: '2023-07-01', downloadUrl: '#' },
  ];

  const reportsToRender = data?.reports || dummyReports;

  return (
    <div>
      {reportsToRender.map((report) => (
        <ReportItem key={report.id} {...report} />
      ))}
      <button className="btn btn-primary w-full mt-4">Generate New Report</button>
    </div>
  );
};

export default AdminReportsComponent;