import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const CARDINALITY_OPTIONS = [
  { value: '1:1', label: 'One to One (1:1)', description: 'Each record in source relates to exactly one in target' },
  { value: '1:N', label: 'One to Many (1:N)', description: 'One record in source relates to many in target' },
  { value: 'N:1', label: 'Many to One (N:1)', description: 'Many records in source relate to one in target' },
  { value: 'N:N', label: 'Many to Many (N:N)', description: 'Many records relate to many (requires junction table)' },
];

const RELATIONSHIP_TYPES = [
  { value: 'identifying', label: 'Identifying', description: 'Child cannot exist without parent' },
  { value: 'non-identifying', label: 'Non-Identifying', description: 'Child can exist independently' },
];

function RelationshipFormModal({ isOpen, onClose, onSave, onDelete, relationship = null, entities = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    cardinality: '1:N',
    type: 'non-identifying',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (relationship) {
      setFormData({
        name: relationship.data?.name || '',
        cardinality: relationship.data?.cardinality || '1:N',
        type: relationship.data?.type || 'non-identifying',
        description: relationship.data?.description || '',
      });
    } else {
      setFormData({
        name: '',
        cardinality: '1:N',
        type: 'non-identifying',
        description: '',
      });
    }
    setErrors({});
  }, [relationship, isOpen]);

  const validate = () => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this relationship?')) {
      onDelete(relationship.id);
      onClose();
    }
  };

  const getEntityName = (entityId) => {
    const entity = entities.find(e => e.id === entityId);
    return entity?.data?.name || entityId;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={relationship ? 'Edit Relationship' : 'Create New Relationship'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Show connected entities if editing */}
        {relationship && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center justify-between text-sm">
              <div className="font-semibold text-indigo-900">
                {getEntityName(relationship.source)}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-indigo-400"></div>
                <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-bold rounded">
                  {formData.cardinality}
                </span>
                <div className="h-px w-8 bg-indigo-400"></div>
                <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="font-semibold text-purple-900">
                {getEntityName(relationship.target)}
              </div>
            </div>
          </div>
        )}

        {/* Relationship Name */}
        <Input
          label="Relationship Name (Optional)"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., places, contains, belongs_to"
        />

        {/* Cardinality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardinality
          </label>
          <div className="space-y-2">
            {CARDINALITY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.cardinality === option.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="cardinality"
                  value={option.value}
                  checked={formData.cardinality === option.value}
                  onChange={(e) => handleChange('cardinality', e.target.value)}
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Relationship Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship Type
          </label>
          <div className="space-y-2">
            {RELATIONSHIP_TYPES.map((option) => (
              <label
                key={option.value}
                className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.type === option.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={option.value}
                  checked={formData.type === option.value}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this relationship..."
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {relationship && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            fullWidth={!relationship}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            {relationship ? 'Update Relationship' : 'Create Relationship'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default RelationshipFormModal;