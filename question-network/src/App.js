
// import './App.css';
// import React, { useEffect, useState } from 'react';
// import ForceGraph3D from 'react-force-graph-3d';
// import neo4j from 'neo4j-driver';

// // ⚡ Connect to Neo4j database (Update with your credentials)
// const driver = neo4j.driver(
//   'neo4j+s://ae4595f1.databases.neo4j.io',
//   neo4j.auth.basic(
//      'neo4j',
//      'ya2GCDsdQW4Vm3nhNTccxfgsNjpO6sDUFC3dMAtP6rU',
//   ));



// function App() {
//   // ✅ Use state for Gdata to trigger re-renders
//   const [graphData, setGraphData] = useState({
//     nodes: [{ id: 'Question-Node', name: 'Question' }],
//     links: []
//   });
//   const [selectedNode, setSelectedNode] = useState(null);


  
//   function handleNodeClick(node) {
//     setSelectedNode(node.id); // Store selected node ID
//     alert(`Selected target node: ${node.name}`);
//   }

//   function addNode() {
//     if (!selectedNode) {
//       alert("Please select a target node first.");
//       return;
//     }

//     const input_name = prompt("Enter new node name:");
//     if (!input_name) return;

//     const input_id = prompt("Enter new node ID:");
//     if (!input_id) return;

//     let input_type = prompt("Is this an 'agree' or 'disagree' node?").toLowerCase();
//     if (!["agree", "disagree"].includes(input_type)) {
//       alert("Invalid input. Please enter 'agree' or 'disagree'.");
//       return;
//     }

//     const input_color = input_type === "agree" ? "green" : "red";

//     setGraphData(prevData => ({
//       nodes: [...prevData.nodes, { id: input_id, name: input_name, color: input_color }],
//       links: [...prevData.links, { source: input_id, target: selectedNode }]
//     }));

    
//     }


  

//   return (
//     <div className="App">
//       <button onClick={addNode} style={{ margin: '10px', padding: '10px' }}>
//         Add Node
//       </button>
//       <ForceGraph3D
//         graphData={graphData}
//         nodeAutoColorBy="color"
//         nodeLabel="name"
//         onNodeClick={handleNodeClick} // Selects a target node when clicked
//       />
//     </div>

//   );
// }

// export default App;

import './App.css';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import neo4j from 'neo4j-driver';

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
    nodes: [{ id: 'Question-Node', name: 'Question', color: 'blue' }],
    links: []
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const fgRef = useRef(null); // Reference to ForceGraph3D instance


    // Function to reset zoom
    const resetZoom = useCallback(() => {
      if (fgRef.current) {
        fgRef.current.cameraPosition(
          { x: 0, y: 0, z: 500 }, // Reset to default position
          { x: 0, y: 0, z: 0 }, // Look at graph center
          1500  // Smooth transition
        );
      }
    }, []);

  // Handle node click (select node + zoom to node)
  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node.id);
    alert(`Selected target node: ${node.name}`);

    // Ensure zooming does not reset graph data
    if (fgRef.current) {
      const distance = 20; // Adjust zoom level
      const distRatio = 1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // New camera position
        node,  // Look at the selected node
        3000   // Smooth transition
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

    let input_type = prompt("Is this an 'agree' or 'disagree' node?").toLowerCase();
    if (!["agree", "disagree"].includes(input_type)) {
      alert("Invalid input. Please enter 'agree' or 'disagree'.");
      return;
    }

    const input_color = input_type === "agree" ? "green" : "red";

    setGraphData(prevData => ({
      nodes: [...prevData.nodes, { id: input_id, name: input_name, color: input_color }],
      links: [...prevData.links, { source: selectedNode, target: input_id }]
    }));
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
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="color"
        nodeLabel="name"
        onNodeClick={handleNodeClick} // Selects a target node and zooms into it
      />
    </div>
  );
}

export default App;
