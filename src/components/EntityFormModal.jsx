import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

function EntityFormModal({ isOpen, onClose, onSave, entity = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    columns: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entity) {
      setFormData({
        name: entity.data.name || '',
        description: entity.data.description || '',
        columns: entity.data.columns || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        columns: []
      });
    }
    setErrors({});
  }, [entity, isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Entity name is required';
    }

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={entity ? 'Edit Entity' : 'Create New Entity'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Entity Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Customer, Order, Product"
          error={errors.name}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this entity..."
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            {entity ? 'Update Entity' : 'Create Entity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EntityFormModal;