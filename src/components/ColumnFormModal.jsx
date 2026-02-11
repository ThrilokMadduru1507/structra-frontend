import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const DATA_TYPES = [
  'INTEGER',
  'BIGINT',
  'SMALLINT',
  'DECIMAL(10,2)',
  'NUMERIC',
  'FLOAT',
  'REAL',
  'VARCHAR(50)',
  'VARCHAR(100)',
  'VARCHAR(255)',
  'TEXT',
  'CHAR(10)',
  'BOOLEAN',
  'DATE',
  'TIME',
  'TIMESTAMP',
  'DATETIME',
  'JSON',
  'UUID'
];

function ColumnFormModal({ isOpen, onClose, onSave, column = null, existingColumns = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'VARCHAR(50)',
    isPrimaryKey: false,
    isForeignKey: false,
    isNullable: true,
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (column) {
      setFormData({
        name: column.name || '',
        type: column.type || 'VARCHAR(50)',
        isPrimaryKey: column.isPrimaryKey || false,
        isForeignKey: column.isForeignKey || false,
        isNullable: column.isNullable !== undefined ? column.isNullable : true,
        description: column.description || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'VARCHAR(50)',
        isPrimaryKey: false,
        isForeignKey: false,
        isNullable: true,
        description: ''
      });
    }
    setErrors({});
  }, [column, isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Column name is required';
    }

    // Check for duplicate names
    const isDuplicate = existingColumns.some(
      col => col.name.toLowerCase() === formData.name.toLowerCase().trim() 
        && col !== column
    );

    if (isDuplicate) {
      newErrors.name = 'A column with this name already exists';
    }

    // Validate column name format
    if (formData.name && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.name)) {
      newErrors.name = 'Column name must start with letter/underscore and contain only letters, numbers, and underscores';
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
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // If setting as primary key, make it not nullable
      if (field === 'isPrimaryKey' && value === true) {
        updated.isNullable = false;
      }
      
      return updated;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={column ? 'Edit Column' : 'Add New Column'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Column Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., customer_id"
          error={errors.name}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {DATA_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this column..."
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrimaryKey"
              checked={formData.isPrimaryKey}
              onChange={(e) => handleChange('isPrimaryKey', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isPrimaryKey" className="text-sm text-gray-700">
              Primary Key
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isForeignKey"
              checked={formData.isForeignKey}
              onChange={(e) => handleChange('isForeignKey', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isForeignKey" className="text-sm text-gray-700">
              Foreign Key
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isNullable"
              checked={formData.isNullable}
              onChange={(e) => handleChange('isNullable', e.target.checked)}
              disabled={formData.isPrimaryKey}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="isNullable" className={`text-sm ${formData.isPrimaryKey ? 'text-gray-400' : 'text-gray-700'}`}>
              Allow NULL values {formData.isPrimaryKey && '(disabled for Primary Keys)'}
            </label>
          </div>
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
            {column ? 'Update Column' : 'Add Column'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ColumnFormModal;