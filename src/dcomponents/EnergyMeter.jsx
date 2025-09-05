import React from "react";

const EnergyMeter = ({
  name,
  totalKW,
  maxKW,
  consumption,
  cost,
  statusColor,
  overload,
}) => {
  return (
    <div
      style={{
        border: `1px solid ${overload ? "red" : "#ddd"}`,
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: overload ? "#FFE6E6" : "white",
        width: "220px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: "bold", fontSize: "14px" }}>{name}</span>
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: statusColor || "red",
            alignSelf: "center",
          }}
        ></span>
      </div>

      {/* Gauge (simulated with a semicircle div) */}
      <div
        style={{
          margin: "16px 0",
          position: "relative",
          height: "120px",
          width: "120px",
          borderRadius: "50%",
          border: `6px solid ${overload ? "red" : "#ddd"}`,
          borderTopColor: totalKW > maxKW * 0.75 ? "orange" : "green",
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          transform: "rotate(135deg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              color: overload ? "red" : "black",
            }}
          >
            {totalKW.toFixed(2)} kW
          </div>
          <div style={{ fontSize: "12px", color: "#555" }}>Total</div>
        </div>
      </div>

      {/* Consumption and Cost */}
      <div style={{ fontSize: "12px", color: "#555", marginTop: "8px" }}>
        <div>Consumpti: {consumption.toLocaleString()} kWh</div>
        <div>Cost: ₹{cost.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default EnergyMeter;
