import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const CustomTooltip = ({ content, isVisible, positionStyles, onClose }) => {
  const tooltipRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
    className="absolute bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg z-50"
    style={{ top: positionStyles.top, left: positionStyles.left, whiteSpace: 'nowrap' }}
  >
    {content}
    <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-800"></div>
  </div>
  ,
    document.body
  );
};

export default CustomTooltip;