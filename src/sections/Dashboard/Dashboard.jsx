import React from 'react';
import EDashboard from './EDashboard';
import WDashboard from './WDashboard';
import ADashboard from './ADashboard';

const Dashboard = ({ activeBlock }) => {
  return (
    <>
      {activeBlock === 'Energy' && <EDashboard />}
      {activeBlock === 'Water' && <WDashboard />}
      {activeBlock === 'Air' && <ADashboard />}
    </>
  );
};

export default Dashboard;
