import React, { useState } from 'react';
import './Documentation.css';

const Documentation = () => {
  // State to hold uploaded files for each compartment
  const [systemReports, setSystemReports] = useState([]);
  const [operationalManuals, setOperationalManuals] = useState([]);
  const [complianceCertifications, setComplianceCertifications] = useState([]);

  // Handler for file uploads
  const handleFileUpload = (event, setFiles) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
  };

  // Compartment rendering function
  const renderCompartment = (title, files, setFiles) => (
    <div className="bg-white rounded-lg p-4 mb-4">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <input 
        type="file" 
        multiple 
        onChange={(e) => handleFileUpload(e, setFiles)} 
        className="file-upload mb-2"
      />
      <div className="file-list">
        {files.length > 0 ? (
          files.map((file, index) => (
            <p key={index} className="text-sm text-gray-700">
              {file.name}
            </p>
          ))
        ) : (
          <p className="text-sm text-gray-500">No files uploaded yet.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 rounded-2xl p-8 mx-5 my-3">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Files</h3>
      <p className="text-gray-600 mb-8">Upload and organize files in relevant compartments.</p>
      
      {renderCompartment("System Reports", systemReports, setSystemReports)}
      {renderCompartment("Operational Manuals", operationalManuals, setOperationalManuals)}
      {renderCompartment("Compliance & Certifications", complianceCertifications, setComplianceCertifications)}
    </div>
  );
};

export default Documentation;