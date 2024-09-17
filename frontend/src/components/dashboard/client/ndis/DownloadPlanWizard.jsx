import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileDownload, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import NDISPlanPDF from './NDISPlanPDF';

const DownloadPlanWizard = ({ isOpen, onClose, planData }) => {
  const [step, setStep] = useState(1);
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    fundingCategories: true,
    goals: true,
    serviceWorker: true
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
          <h2 className="text-2xl font-bold">Download NDIS Plan</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        {step === 1 && (
          <div>
            <p className="mb-4">Select the sections you want to include in your downloaded plan:</p>
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
            <p className="mb-4">Your NDIS Plan PDF is ready to be generated with the selected sections.</p>
            <p>Click "Download" to get your customized plan.</p>
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
              document={<NDISPlanPDF planData={planData} selectedSections={selectedSections} />}
              fileName="NDIS_Plan.pdf"
              className="btn btn-primary flex items-center ml-auto"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Generating PDF...' : <><FaFileDownload className="mr-2" /> Download PDF</>
              }
            </PDFDownloadLink>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DownloadPlanWizard;