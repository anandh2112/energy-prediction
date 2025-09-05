import React, { useState } from 'react';
import '../App.css';

const Multimeter = () => {
  const [angle, setAngle] = useState(0); // Needle angle
  const [value, setValue] = useState(0); // Display value

  const handleMouseDown = (e) => {
    const moveNeedle = (event) => {
      const multimeter = document.querySelector('.multimeter');
      const rect = multimeter.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height;
      const dx = event.clientX - centerX;
      const dy = centerY - event.clientY;
      const newAngle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Limit the needle movement from -90 to 90 degrees
      if (newAngle >= -90 && newAngle <= 90) {
        setAngle(newAngle);
        const newValue = Math.round(((newAngle + 90) / 180) * 100); // Convert angle to value (0 to 100)
        setValue(newValue);
      }
    };

    document.addEventListener('mousemove', moveNeedle);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', moveNeedle);
    });
  };

  // Generate tick marks and values
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const tickAngle = (i * 180) / 10 - 90; // Spread evenly between -90 to 90
    const valueLabel = (i * 10).toString(); // Values 0 to 100
    return (
      <div
        key={i}
        className="tick-mark"
        style={{ transform: `rotate(${tickAngle}deg) translateY(-200px)` }} // Adjusted for larger size
      >
        <div
          className="tick-label"
          style={{ transform: `rotate(${-tickAngle}deg) translateY(-30px)` }}
        >
          {valueLabel}
        </div>
      </div>
    );
  });

  return (
    <div className="multimeter-container">
      <div className="multimeter">
        {/* Needle */}
        <div
          className="needle"
          style={{ transform: `rotate(${angle}deg)` }}
          onMouseDown={handleMouseDown} // Dragging the needle
        ></div>

        {/* Center needle pivot */}
        <div className="needle-pivot"></div>

        {/* Tick marks */}
        <div className="tick-marks">{ticks}</div>

        {/* Display current reading */}
        <div className="reading">Reading: {value}</div>
      </div>
    </div>
  );
};

export default Multimeter;
