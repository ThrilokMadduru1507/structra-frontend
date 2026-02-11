import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

function DiagramCanvas({ 
  nodes = [],
  edges = [],
  nodeTypes,
  edgeTypes,  // ← Must be in params
  onNodesChange, 
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick
}) {

  return (
    <div className="w-full h-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}  // ← Must be passed to ReactFlow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#94a3b8" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => '#6366f1'}
          maskColor="rgb(240, 240, 255, 0.6)"
        />
      </ReactFlow>
    </div>
  );
}

export default DiagramCanvas;