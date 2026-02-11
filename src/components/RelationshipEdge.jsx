import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';

function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edge clicked, id:', id);
    console.log('Edge data:', data);
    if (data?.onRelationshipClick) {
      console.log('Calling onRelationshipClick');
      data.onRelationshipClick(id);
    } else {
      console.log('NO onRelationshipClick handler found!');
    }
  };

  const cardinalityLabel = data?.cardinality || '1:N';
  const relationshipName = data?.name || '';

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 1000,
          }}
        >
          <div
            onMouseDown={handleClick}
            className="px-3 py-1.5 bg-white border-2 border-indigo-500 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors cursor-pointer"
            style={{ pointerEvents: 'all' }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-bold text-indigo-700">{cardinalityLabel}</span>
              {relationshipName && (
                <span className="text-xs text-gray-600">{relationshipName}</span>
              )}
            </div>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default RelationshipEdge;