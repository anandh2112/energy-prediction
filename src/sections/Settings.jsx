import React, { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import userprofile from "../components/userprofile.png";

const Settings = ({ setUserProfileName }) => {
  const [firstName, setFirstName] = useState("Admin");
  const [lastName, setLastName] = useState("User");
  const [email, setEmail] = useState("admin@example.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [profilePicture, setProfilePicture] = useState(userprofile);
  const [isOtpCardVisible, setIsOtpCardVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUserProfileName(firstName);
    alert("Changes saved!");
  };

  const handleCancel = () => {
    setFirstName("Admin");
    setLastName("User");
    setPhone("123-456-7890");
    setProfilePicture(userprofile);
    setOldPassword("");
    setNewPassword("");
  };

  const handleVerifyClick = () => {
    setIsOtpCardVisible(true);
  };

  const handleOtpSubmit = () => {
    // Handle OTP submission logic here
    setIsOtpCardVisible(false);
    alert(`OTP entered: ${otp}`);
  };

  const handleOtpCancel = () => {
    setIsOtpCardVisible(false);
    setOtp("");
  };

  return (
    <div className="relative pl-4 pr-4 pt-4 xl:pt-[4vh] max-w-5xl mx-auto">
      {isOtpCardVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mb-4 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter OTP"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleOtpCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-8 text-center">Settings</h1>

        {/* Profile Picture */}
        <div className="relative group w-32 h-32 mx-auto mb-10">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full opacity-0">
            <label
              htmlFor="profilePictureInput"
              className="cursor-pointer text-white"
            >
            </label>
          </div>
        </div>

        {/* First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Email and Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              value={email}
              readOnly
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="flex">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              <button
                onClick={handleVerifyClick}
                className="ml-4 mt-1 p-2 text-sm bg-blue-500 text-white rounded-md"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;