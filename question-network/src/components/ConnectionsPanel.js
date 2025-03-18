import React from 'react';

const ConnectionsPanel = ({ selectedNode, graphData }) => {
    if (!selectedNode) return null;

    // Find the actual node object from graphData
    const node = graphData.nodes.find(n => n.id === selectedNode);
    if (!node) return null;

    // Get all connections involving this node
    const allConnections = [];
    
    // Add outgoing connections from this node
    graphData.links.forEach(link => {
        // Handle both object and string source/target
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        
        if (sourceId === selectedNode) {
            const targetNode = typeof link.target === 'object' ? link.target : graphData.nodes.find(n => n.id === targetId);
            if (targetNode) {
                allConnections.push({
                    node: targetNode,
                    sentiment: link.color === 'green' ? 'Agree' : 'Disagree',
                    direction: 'outgoing'
                });
            }
        }
    });

    // Add incoming connections to this node
    graphData.links.forEach(link => {
        // Handle both object and string source/target
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        
        if (targetId === selectedNode) {
            const sourceNode = typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === sourceId);
            if (sourceNode) {
                allConnections.push({
                    node: sourceNode,
                    sentiment: link.color === 'green' ? 'Agree' : 'Disagree',
                    direction: 'incoming'
                });
            }
        }
    });

    const panelStyle = {
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '300px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxHeight: '80vh',
        overflowY: 'auto'
    };

    const selectedNodeStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
    };

    const connectionStyle = {
        marginBottom: '10px',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    };

    return (
        <div style={panelStyle}>
            <div style={selectedNodeStyle}>
                <div>
                    <div style={{ fontWeight: 'bold' }}>Selected Node: {node.name}</div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>ID: {node.id}</div>
                </div>
            </div>

            <h3>Connections</h3>
            {allConnections.length > 0 ? (
                allConnections.map((connection, index) => (
                    <div 
                        key={index} 
                        style={{
                            ...connectionStyle,
                            borderLeft: `3px solid ${connection.sentiment === 'Agree' ? 'green' : 'red'}`
                        }}
                    >
                        <div style={{ fontWeight: 'bold' }}>{connection.node.name}</div>
                        <div style={{ fontSize: '0.9em', color: '#666' }}>ID: {connection.node.id}</div>
                        <div style={{ fontSize: '0.8em', color: '#999' }}>
                            {connection.direction === 'incoming' ? '← Incoming' : 'Outgoing →'}
                            {' • '}
                            {connection.sentiment}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ color: '#666' }}>No connections</div>
            )}
        </div>
    );
};

export default ConnectionsPanel; 