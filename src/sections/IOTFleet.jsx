import React from 'react';
import '../pages/IOTFleet.css';

const IoTFleetStatus = () => {
  return (
    <div className="iot-fleet-status">
      <div className="top-node">Root Node</div>
      <div className="child-nodes">
        {/* Child Node 1 */}
        <div className="child-node-container">
          <div className="child-node active">
            <div className="node-content">Node 1</div>
          </div>
          <div className="grandchild-nodes">
            <div className="grandchild-node active">Child 1A</div>
            <div className="grandchild-node warning">Child 1B</div>
          </div>
        </div>

        {/* Child Node 2 */}
        <div className="child-node-container">
          <div className="child-node warning">
            <div className="node-content">Node 2</div>
          </div>
          <div className="grandchild-nodes">
            <div className="grandchild-node offline">Child 2A</div>
            <div className="grandchild-node active">Child 2B</div>
          </div>
        </div>

        {/* Child Node 3 */}
        <div className="child-node-container">
          <div className="child-node offline">
            <div className="node-content">Node 3</div>
          </div>
          <div className="grandchild-nodes">
            <div className="grandchild-node active">Child 3A</div>
            <div className="grandchild-node warning">Child 3B</div>
          </div>
        </div>

        {/* Child Node 4 */}
        <div className="child-node-container">
          <div className="child-node active">
            <div className="node-content">Node 4</div>
          </div>
          <div className="grandchild-nodes">
            <div className="grandchild-node warning">Child 4A</div>
            <div className="grandchild-node offline">Child 4B</div>
          </div>
        </div>

        {/* Child Node 5 */}
        <div className="child-node-container">
          <div className="child-node warning">
            <div className="node-content">Node 5</div>
          </div>
          <div className="grandchild-nodes">
            <div className="grandchild-node active">Child 5A</div>
            <div className="grandchild-node offline">Child 5B</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTFleetStatus;
