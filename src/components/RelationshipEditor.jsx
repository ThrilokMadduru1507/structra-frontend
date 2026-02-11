import { useState } from 'react';
import Button from './Button';

function RelationshipEditor({ relationship, sourceNode, targetNode, onSave, onClose }) {
  const [name, setName] = useState(relationship.name || 'relates to');
  const [cardinality, setCardinality] = useState(relationship.cardinality || '1:N');
  const [type, setType] = useState(relationship.type || 'non-identifying');

  const handleSave = () => {
    onSave({
      name,
      cardinality,
      type
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Relationship</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Relationship Overview */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="text-sm font-semibold text-gray-900">
                  {sourceNode?.data?.name || 'Source'}
                </div>
                <div className="text-xs text-gray-500">Source Entity</div>
              </div>
              
              <div className="px-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              
              <div className="text-center flex-1">
                <div className="text-sm font-semibold text-gray-900">
                  {targetNode?.data?.name || 'Target'}
                </div>
                <div className="text-xs text-gray-500">Target Entity</div>
              </div>
            </div>
          </div>

          {/* Relationship Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., has, belongs to, contains"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Cardinality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardinality
            </label>
            <div className="grid grid-cols-4 gap-3">
              {['1:1', '1:N', 'N:1', 'N:M'].map((card) => (
                <button
                  key={card}
                  onClick={() => setCardinality(card)}
                  className={`px-4 py-3 border-2 rounded-lg font-semibold transition-all ${
                    cardinality === card
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {card}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {cardinality === '1:1' && 'One-to-One: Each record relates to exactly one record'}
              {cardinality === '1:N' && 'One-to-Many: One record relates to multiple records'}
              {cardinality === 'N:1' && 'Many-to-One: Multiple records relate to one record'}
              {cardinality === 'N:M' && 'Many-to-Many: Multiple records relate to multiple records'}
            </p>
          </div>

          {/* Relationship Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType('identifying')}
                className={`px-4 py-3 border-2 rounded-lg font-semibold transition-all ${
                  type === 'identifying'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Identifying
              </button>
              <button
                onClick={() => setType('non-identifying')}
                className={`px-4 py-3 border-2 rounded-lg font-semibold transition-all ${
                  type === 'non-identifying'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Non-Identifying
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {type === 'identifying' && 'The relationship is part of the primary key'}
              {type === 'non-identifying' && 'The relationship is not part of the primary key'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RelationshipEditor;