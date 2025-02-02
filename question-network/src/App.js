
import './App.css';
import ForceGraph3D from 'react-force-graph-3d';


const Gdata = {nodes: [{id:'Question-Node', name: 'Question'}, {id: 'Agree', name: 'Agree', color: 'green'}], 
links: [{source:"Question-Node", target:"Agree"}]};

function App({driver}) {
  return (
    <div className="App">
      <ForceGraph3D graphData = {Gdata}/>
    </div>
  );
}

export default App;
