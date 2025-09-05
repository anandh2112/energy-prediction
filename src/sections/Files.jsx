import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaTrash, FaDownload } from 'react-icons/fa';
import axios from 'axios';

const Files = () => {
  const [selectedCategory, setSelectedCategory] = useState("Energy Bills");
  const [files, setFiles] = useState({
    "Energy Bills": [],
    Manuals: [],
    Miscellaneous: [],
  });

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', selectedCategory);

    try {
      const response = await axios.post(
        `https://mw.elementsenergies.com/api/uploadF?category=${selectedCategory}&cacheBuster=${Date.now()}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const { fileUrl } = response.data;
      updateFiles(selectedCategory, {
        name: file.name,
        date: new Date().toLocaleDateString(),
        url: `https://mw.elementsenergies.com${fileUrl}`,
      });

      event.target.value = null; 
    } catch {
      alert('Failed to upload file');
    }
  };

  const handleRemoveFile = async (index) => {
    const categoryFiles = files[selectedCategory];
    const fileToDelete = categoryFiles[index];
    if (!fileToDelete) return;

    try {
      await axios.delete(`https://mw.elementsenergies.com/api/delete`, {
        params: { category: selectedCategory.toLowerCase(), filename: fileToDelete.name },
      });

      updateFiles(selectedCategory, null, index); 
    } catch {
      alert('Failed to delete file');
    }
  };

  const updateFiles = (category, newFile, removeIndex) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [category]: removeIndex !== undefined
        ? prevFiles[category].filter((_, i) => i !== removeIndex)
        : [...prevFiles[category], newFile],
    }));
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `https://mw.elementsenergies.com/api/listF?category=${selectedCategory.toLowerCase()}`
      );

      const formattedFiles = response.data.map((file) => ({
        name: file.name,
        date: file.date,
        url: file.url.startsWith("http") ? file.url : `https://mw.elementsenergies.com${file.url}`,
      }));

      setFiles((prevFiles) => ({ ...prevFiles, [selectedCategory]: formattedFiles }));
    } catch {
      console.error(`Failed to fetch files for category: ${selectedCategory}`);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedCategory]);

  return (
    <div className="flex flex-col items-center h-[92vh] bg-gray-100 p-6">
      <div className="flex items-center mb-6 w-full max-w-6xl">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-lg pr-5"
        >
          {Object.keys(files).map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <div className="ml-4 text-gray-600">Files Uploaded: {files[selectedCategory].length}</div>
      </div>
      <FileTable
        files={files[selectedCategory]}
        onDelete={handleRemoveFile}
        onUpload={handleFileChange}
        category={selectedCategory}
      />
    </div>
  );
};

const FileTable = ({ files, onDelete, onUpload, category }) => (
  <div className="w-full">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full mb-4">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 w-1/12">S No.</th>
            <th className="border p-2 w-7/12">File Name</th>
            <th className="border p-2 w-2/12">Date Uploaded</th>
            <th className="border p-2 w-2/12">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr>
              <td className="border p-2 text-center" colSpan="4">No files uploaded</td>
            </tr>
          ) : (
            files.map((file, index) => (
              <tr key={index}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 flex items-center">
                  <FaFilePdf className="mr-2 text-red-600" />
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    {file.name.replace(/\.[^/.]+$/, "")}
                  </a>
                </td>
                <td className="border p-2 text-center">{file.date}</td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center space-x-4">
                    <a href={file.url} download className="text-blue-600">
                      <FaDownload />
                    </a>
                    <button onClick={() => onDelete(index)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    <div className="flex justify-center items-center mt-4">
      <div className="bg-white p-10 rounded-lg shadow-lg">
        <input
          type="file"
          accept="application/pdf"
          onChange={onUpload}
          className="hidden"
          id={`${category.toLowerCase()}-upload`}
        />
        <label
          htmlFor={`${category.toLowerCase()}-upload`}
          className="text-center text-gray-600 cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg"
        >
          Click or drag to upload
        </label>
      </div>
    </div>
  </div>
);

export default Files;