import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import {
  FiMonitor,
  FiAlertCircle,
  FiFileText,
  FiHome,
  FiUser,
  FiSettings,
  FiFolder,
  FiTrendingUp,
} from "react-icons/fi";
import logo from "../logo2.png";

const links = {
  monitor: [
    { name: "eLog", path: "/monitor/overview" },
    { name: "Zones", path: "/monitor/zones" },
    { name: "Peak Analysis", path: "/monitor/peakanalysis" },
    { name: "Diesel Generator", path: "/monitor/generator/1" },
  ],
};

const navItems = [
  { name: "Alerts", path: "/alerts", icon: FiAlertCircle },
  { name: "Building Profile", path: "/profile", icon: FiUser },
  { name: "Files", path: "/files", icon: FiFolder },
  { name: "Reports", path: "/reports", icon: FiFileText },
  { name: "Forecast", path: "/forecast", icon: FiTrendingUp },
  { name: "Settings", path: "/settings", icon: FiSettings },
];

const Sidebar = ({ isCollapsed }) => {
  const [dropdown, setDropdown] = useState({ monitor: false });
  const location = useLocation();
  const sidebarRef = useRef(null);

  const linkClass = (isActive, isCollapsed) =>
    `flex items-center gap-5 p-2 rounded-lg text-md m-2 transition-all duration-300 ${
      isActive
        ? "bg-green-600 text-white shadow"
        : "text-gray-700 hover:bg-green-500 hover:text-white"
    } ${isCollapsed ? "justify-center" : ""}`;

  const iconClass = "text-xl mx-auto lg:mx-0 min-w-[24px] min-h-[24px]";

  const toggleDropdown = (section) => {
    setDropdown((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const closeAllDropdowns = () => {
    setDropdown({ monitor: false });
  };

  useEffect(() => {
    if (isCollapsed) {
      closeAllDropdowns();
    }
  }, [location, isCollapsed]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCollapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isCollapsed]);

  const handleNavLinkClick = () => {
    if (isCollapsed) {
      closeAllDropdowns();
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="h-full w-full overflow-visible bg-white shadow-lg transition-all duration-300 flex flex-col relative"
    >
      <div className="flex justify-center items-center bg-white p-5">
        <Link to="/dashboard">
          <img
            src={logo}
            alt="logo"
            className="h-auto w-auto object-contain min-w-[49px]"
          />
        </Link>
      </div>

      <div className="mt-8 flex flex-col w-full">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => linkClass(isActive, isCollapsed)}
        >
          <FiHome className={iconClass} />
          <span className={`${isCollapsed ? "hidden" : "block"}`}>
            Dashboard
          </span>
        </NavLink>

        {/* Monitor Dropdown */}
        <div className="relative">
          <div
            className={`cursor-pointer ${linkClass(false, isCollapsed)} relative`}
            onClick={() => toggleDropdown("monitor")}
          >
            <div className="flex items-center gap-5">
              <FiMonitor className={iconClass} />
              {!isCollapsed && <span>Monitor</span>}
              {!isCollapsed &&
                (dropdown.monitor ? (
                  <MdKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                ))}
            </div>
          </div>

          {!isCollapsed && dropdown.monitor && (
            <div className="ml-6 mt-2 flex flex-col">
              {links.monitor.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded transition-all duration-300 ${
                      isActive
                        ? "text-white bg-green-600"
                        : "text-gray-600 hover:bg-green-500 hover:text-white"
                    }`
                  }
                  onClick={() => {
                    handleNavLinkClick();
                    if (isCollapsed) toggleDropdown("monitor");
                  }}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}

          {isCollapsed && dropdown.monitor && (
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-white shadow-xl rounded-lg w-48 p-2 z-[99999] border border-gray-300">
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-300"></div>

              {links.monitor.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded transition-all duration-300 ${
                      isActive
                        ? "text-white bg-green-600"
                        : "text-gray-600 hover:bg-green-500 hover:text-white"
                    }`
                  }
                  onClick={() => {
                    handleNavLinkClick();
                    toggleDropdown("monitor");
                  }}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Other Nav Items */}
        {navItems.map(({ name, path, icon: Icon }, index) => (
          <NavLink
            key={index}
            to={path}
            className={({ isActive }) => linkClass(isActive, isCollapsed)}
          >
            <Icon className={iconClass} />
            {!isCollapsed && <span>{name}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
