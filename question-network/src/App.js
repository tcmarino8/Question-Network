import './App.css';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import neo4j from 'neo4j-driver';
import ConnectionsPanel from './components/ConnectionsPanel';

// ⚡ Connect to Neo4j database (Update with your credentials)
const driver = neo4j.driver(
  'neo4j+s://ae4595f1.databases.neo4j.io',
  neo4j.auth.basic(
    'neo4j',
    'ya2GCDsdQW4Vm3nhNTccxfgsNjpO6sDUFC3dMAtP6rU',
  )
);

function App() {
  const [graphData, setGraphData] = useState({
    nodes: [{ id: 'Question-Node', name: 'Question', color: 'blue', x: 0, y: 0, z: 0 }],
    links: []
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [showChoice, setShowChoice] = useState(false);
  const [pendingNode, setPendingNode] = useState(null);

  const fgRef = useRef(null);

  // Function to reset zoom
  const resetZoom = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.cameraPosition(
        { x: 0, y: 0, z: 500 },
        { x: 0, y: 0, z: 0 },
        1500
      );
    }
  }, []);

  // Handle node click (select node + zoom to node)
  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node.id);

    if (fgRef.current) {
      const distance = 20;
      const distRatio = 1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        3000
      );
    }
  }, []);

  // Add a new node connected to the selected node
  function addNode() {
    if (!selectedNode) {
      alert("Please select a target node first.");
      return;
    }

    const input_name = prompt("Enter new node name:");
    if (!input_name) return;

    const input_id = prompt("Enter new node ID:");
    if (!input_id) return;

    setPendingNode({ id: input_id, name: input_name });
    setShowChoice(true);
  }

  // Handles agree/disagree selection
  function handleChoice(choice) {
    if (!pendingNode) return;

    const input_color = choice === "agree" ? "green" : "red";
    
    // Find the selected node's position
    const selectedNodeObj = graphData.nodes.find(n => n.id === selectedNode);
    const baseX = selectedNodeObj ? selectedNodeObj.x : 0;
    
    // Calculate new node position based on agreement
    // Agree nodes go to the right, disagree nodes to the left
    const xOffset = choice === "agree" ? 100 : -100;
    const newX = baseX + xOffset;
    
    // Add some random variation to y and z to prevent nodes from stacking
    const newY = (Math.random() - 0.5) * 50;
    const newZ = (Math.random() - 0.5) * 50;

    setGraphData(prevData => ({
      nodes: [...prevData.nodes, { 
        ...pendingNode, 
        color: input_color,
        x: newX,
        y: newY,
        z: newZ
      }],
      links: [...prevData.links, { 
        source: selectedNode, 
        target: pendingNode.id,
        color: input_color
      }]
    }));

    setShowChoice(false);
    setPendingNode(null);
    setSelectedNode(null);

    // Reset zoom after adding a node
    setTimeout(() => resetZoom(), 500);
  }

  return (
    <div className="App">
      <button onClick={addNode} style={{ margin: '10px', padding: '10px' }}>
        Respond
      </button>
      <button onClick={resetZoom} style={{ margin: '10px', padding: '10px' }}>
        See Entire Network
      </button>
      {showChoice && (
        <div className="choice-popup">
          <p>Do you Agree or Disagree with "{selectedNode}"?</p>
          <button onClick={() => handleChoice("agree")} style={{ backgroundColor: "green", margin: '5px', padding: '10px' }}>Agree</button>
          <button onClick={() => handleChoice("disagree")} style={{ backgroundColor: "red", margin: '5px', padding: '10px' }}>Disagree</button>
        </div>
      )}
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="color"
        nodeLabel="name"
        linkColor='color'
        onNodeClick={handleNodeClick}
        enableNodeDrag={true}
        enableNodeRelabel={true}
        enableNavigationControls={true}
        enablePointerInteraction={true}
      />
      <ConnectionsPanel selectedNode={selectedNode} graphData={graphData} />
    </div>
  );
}

export default App;
