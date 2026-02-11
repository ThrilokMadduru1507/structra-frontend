import Button from './Button';

function RelationshipPropertiesPanel({ relationship, entities, onEdit, onDelete, onClose }) {
  if (!relationship) {
    return (
      <div className="p-6 text-center text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <p className="text-sm font-medium">Select a relationship to view properties</p>
        <p className="text-xs text-gray-400 mt-1">Click on a relationship line</p>
      </div>
    );
  }

  const getEntityName = (entityId) => {
    const entity = entities.find(e => e.id === entityId);
    return entity?.data?.name || 'Unknown';
  };

  const sourceEntity = getEntityName(relationship.source);
  const targetEntity = getEntityName(relationship.target);
  const cardinality = relationship.data?.cardinality || '1:N';
  const type = relationship.data?.type || 'non-identifying';
  const name = relationship.data?.name || '';
  const description = relationship.data?.description || '';

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900">Relationship Properties</h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Visual Representation */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold text-indigo-900">{sourceEntity}</div>
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-indigo-400"></div>
              <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-bold rounded">
                {cardinality}
              </span>
              <div className="h-px w-8 bg-indigo-400"></div>
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="font-semibold text-purple-900">{targetEntity}</div>
          </div>
        </div>

        {/* Relationship Info */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Relationship Information
          </h4>
          <div className="space-y-3">
            {name && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <p className="text-sm font-medium text-gray-900">{name}</p>
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-500 mb-1">Cardinality</label>
              <p className="text-sm font-medium text-gray-900">{cardinality}</p>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <p className="text-sm text-gray-900 capitalize">{type.replace('-', ' ')}</p>
            </div>

            {description && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <p className="text-sm text-gray-700">{description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Connected Entities */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Connected Entities
          </h4>
          <div className="space-y-2">
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="text-xs text-indigo-600 font-semibold mb-1">Source</div>
              <div className="text-sm font-medium text-gray-900">{sourceEntity}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-xs text-purple-600 font-semibold mb-1">Target</div>
              <div className="text-sm font-medium text-gray-900">{targetEntity}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
        <Button
          variant="primary"
          fullWidth
          onClick={() => onEdit(relationship)}
        >
          Edit Relationship
        </Button>
        <Button
          variant="danger"
          fullWidth
          onClick={() => {
            if (confirm('Are you sure you want to delete this relationship?')) {
              onDelete(relationship.id);
            }
          }}
        >
          Delete Relationship
        </Button>
      </div>
    </div>
  );
}

export default RelationshipPropertiesPanel;