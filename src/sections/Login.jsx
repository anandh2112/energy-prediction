import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo2.png';


const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add authentication logic here
    navigate('/dashboard'); // Redirect to Dashboard after login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?energy,renewable')" }}>
      <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Elements Energy Logo" className="mx-auto mb-4 h-16" />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Elements Energy</h1>
          <p className="text-sm text-gray-600">Optimizing energy solutions for a sustainable future</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#003F3F] text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
