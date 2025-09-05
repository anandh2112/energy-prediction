import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, subDays, differenceInCalendarDays, isAfter } from 'date-fns';
import { FaCalendarAlt } from 'react-icons/fa';

export default function HeatMap() {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [showPicker, setShowPicker] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [heatmapLayout, setHeatmapLayout] = useState({ x: 0, y: 0 });

  const scrollViewRef = useRef(null);
  const heatmapRef = useRef(null);

  const windowStart = subDays(startDate, 14);
  const windowEnd = startDate;
  const numDays = differenceInCalendarDays(windowEnd, windowStart) + 1;

  const [data, setData] = useState(
    Array(numDays).fill().map(() => Array(24).fill().map(() => Math.floor(Math.random() * 401)))
  );

  useEffect(() => {
    setData(
      Array(numDays).fill().map(() => Array(24).fill().map(() => Math.floor(Math.random() * 401)))
    );
  }, [startDate]);

  useEffect(() => {
    if (heatmapRef.current) {
      const rect = heatmapRef.current.getBoundingClientRect();
      setHeatmapLayout({ x: rect.x, y: rect.y });
    }
  }, [data]);

  const colorValues = [
    '#066A06', '#298F35', '#4DB458', '#6AC96A', '#8EDC7F', '#B1EF98',
    '#BBF558', '#DAEF2A', '#F9E900', '#FFF400', '#FFE300', '#FFC200',
    '#FFA100', '#FF8100', '#FF5F00', '#FF3F00', '#FF1000'
  ];

  const getColor = (v) => colorValues[Math.min(Math.floor(v / 29), colorValues.length - 1)];

  const handleDateChange = (date) => {
    setShowPicker(false);
    if (date) {
      setStartDate(isAfter(date, today) ? today : date);
    }
  };

  const tooltipMargin = 8;
  const tooltipHeight = 60;
  const tooltipWidth = 140;
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  const tooltipAbsolute = tooltipData && (() => {
    const intendedTop = (heatmapLayout.y || 0) + (tooltipData.top || 0);
    const intendedLeft = (heatmapLayout.x || 0) + (tooltipData.left || 0) - scrollOffset;
    return {
      top: Math.max(tooltipMargin, Math.min(intendedTop, screenHeight - tooltipHeight - tooltipMargin)),
      left: Math.max(tooltipMargin, Math.min(intendedLeft, screenWidth - tooltipWidth - tooltipMargin))
    };
  })();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Energy Heat Map</h2>
          <button onClick={() => setShowPicker(true)} style={styles.calendarButton}>
            <FaCalendarAlt color="#007bff" size={20} />
          </button>
        </div>

        <div style={styles.heatmapWrapper}>
          <div style={styles.yAxis}>
            {Array(numDays).fill().map((_, i) => (
              <div key={i} style={styles.yLabel}>
                {i === 0 || i === numDays - 1
                  ? format(addDays(windowStart, i), 'MMM d')
                  : format(addDays(windowStart, i), 'd')}
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} ref={heatmapRef}>
            <div
              ref={scrollViewRef}
              style={styles.scrollView}
              onScroll={(e) => setScrollOffset(e.currentTarget.scrollLeft)}
            >
              <div style={styles.heatmapGrid}>
                {data.map((row, i) => (
                  <div key={i} style={styles.row}>
                    {row.map((v, j) => (
                      <button
                        key={j}
                        style={styles.cellButton}
                        onClick={() =>
                          setTooltipData({
                            value: v,
                            hour: `${j}:00`,
                            date: format(addDays(windowStart, i), 'MMM d'),
                            top: i * 20 + 6,
                            left: j * 36 + 6
                          })
                        }
                      >
                        <div style={{ ...styles.cell, backgroundColor: getColor(v) }} />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div style={styles.xAxis}>
                {Array(24).fill().map((_, i) => (
                  <div key={i} style={styles.xLabel}>{`${i}:00`}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.legend}>
          <div style={styles.legendHeading}>Energy (kWh)</div>
          <div style={styles.legendBar}>
            {colorValues.map((c, i) => (
              <div key={i} style={{ ...styles.legendBlock, backgroundColor: c }} />
            ))}
          </div>
          <div style={styles.legendLabels}>
            {[0, 100, 200, 300, 400, 500].map((v) => (
              <div key={v}>{v}</div>
            ))}
          </div>
        </div>

        {showPicker && (
          <div style={styles.pickerOverlay}>
            <div style={styles.picker}>
              <input
                type="date"
                value={format(startDate, 'yyyy-MM-dd')}
                max={format(today, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
              />
              <button onClick={() => setShowPicker(false)}>Close</button>
            </div>
          </div>
        )}

        {tooltipData && tooltipAbsolute && (
          <>
            <div style={styles.overlay} onClick={() => setTooltipData(null)} />
            <div style={{ ...styles.tooltip, ...tooltipAbsolute }}>
              <div>Date: {tooltipData.date}</div>
              <div>Hour: {tooltipData.hour}</div>
              <div>Consumption: {tooltipData.value} kWh</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '0 12px', fontFamily: 'Arial, sans-serif' },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #ddd',
    marginTop: 16
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heading: { fontSize: 16, fontWeight: 'bold', margin: 0 },
  calendarButton: { background: 'none', border: 'none', cursor: 'pointer', padding: 5 },
  heatmapWrapper: { display: 'flex', marginBottom: 6 },
  yAxis: { marginRight: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  yLabel: { fontSize: 10, color: '#666', height: 20, display: 'flex', alignItems: 'center' },
  scrollView: {
    overflowX: 'auto',
    marginBottom: 2,
    minWidth: Math.max(36 * 24, window.innerWidth - 70),
    scrollbarWidth: 'none'
  },
  heatmapGrid: { display: 'flex', flexDirection: 'column', position: 'relative' },
  row: { display: 'flex' },
  cellButton: { padding: 0, margin: 0, border: 'none', background: 'none', cursor: 'pointer' },
  cell: { width: 48, height: 28, margin: 0 },
  xAxis: { display: 'flex', marginTop: 8, alignItems: 'center' },
  xLabel: { width: 36, fontSize: 10, color: '#666', textAlign: 'center' },
  legend: { marginTop: 8, padding: '0 2px' },
  legendHeading: { fontSize: 11, fontWeight: 'bold', color: '#666', marginBottom: 1, marginLeft: 4 },
  legendBar: { display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', margin: 0 },
  legendBlock: { flex: 1, height: 10 },
  legendLabels: { display: 'flex', justifyContent: 'space-between', marginTop: 1 },
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 6,
    borderRadius: 6,
    zIndex: 100,
    position: 'fixed',
    color: '#fff',
    fontSize: 10
  },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 },
  pickerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  picker: { backgroundColor: 'white', padding: 20, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 10 }
};
