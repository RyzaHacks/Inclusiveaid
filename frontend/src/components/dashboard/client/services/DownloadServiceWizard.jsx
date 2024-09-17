import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileDownload, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ServicesPDF from './ServicesPDF';

const DownloadServiceWizard = ({ isOpen, onClose, services, selectedDate }) => {
  const [step, setStep] = useState(1);
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    calendar: true,
  });

  const totalSteps = 3;

  const handleSectionToggle = (section) => {
    setSelectedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full m-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Download Services Summary</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        {step === 1 && (
          <div>
            <p className="mb-4">Select the sections you want to include in your downloaded summary:</p>
            <div className="space-y-2">
              {Object.entries(selectedSections).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleSectionToggle(key)}
                    className="form-checkbox h-5 w-5 text-primary-600"
                  />
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-4">Review your selection:</p>
            <ul className="list-disc list-inside">
              {Object.entries(selectedSections).map(([key, value]) => (
                value && <li key={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</li>
              ))}
            </ul>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-4">Your Services Summary PDF is ready to be generated with the selected sections.</p>
            <p>Click "Download" to get your customized summary.</p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button onClick={handleBack} className="btn btn-secondary flex items-center">
              <FaChevronLeft className="mr-2" /> Back
            </button>
          )}
          {step < totalSteps ? (
            <button onClick={handleNext} className="btn btn-primary flex items-center ml-auto">
              Next <FaChevronRight className="ml-2" />
            </button>
          ) : (
<PDFDownloadLink
  document={
    <ServicesPDF 
      services={services} 
      selectedSections={selectedSections}
    />
  }
  fileName="InclusiveAid_Services_Summary.pdf"
  className="btn btn-primary flex items-center justify-center px-4 py-2 rounded-lg transition-colors duration-200"
>
  {({ blob, url, loading, error }) =>
    loading ? (
      <span className="flex items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating PDF...
      </span>
    ) : (
      <>
        <FaFileDownload className="mr-2" /> Download Services Summary
      </>
    )
  }
</PDFDownloadLink>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DownloadServiceWizard;
