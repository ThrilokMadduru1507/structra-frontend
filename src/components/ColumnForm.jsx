import { useState } from 'react';
import Input from './Input';
import Button from './Button';

// Common SQL data types
const DATA_TYPES = [
  'INTEGER',
  'BIGINT',
  'SMALLINT',
  'DECIMAL',
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

// Constraint types
const CONSTRAINT_TYPES = [
  { value: 'primaryKey', label: 'Primary Key' },
  { value: 'foreignKey', label: 'Foreign Key' },
  { value: 'unique', label: 'Unique' }
];

function ColumnForm({ column, onSave, onCancel, existingColumns = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'VARCHAR(50)',
    nullable: true,
    description: '',
    constraints: [],
    ...column // If editing, pre-fill with existing data
  });

  const [errors, setErrors] = useState({});

  // Validate form
  const validate = () => {
    const newErrors = {};

    // Name is required
    if (!formData.name.trim()) {
      newErrors.name = 'Column name is required';
    }

    // Check for duplicate names (excluding current column if editing)
    const isDuplicate = existingColumns.some(
      col => col.name.toLowerCase() === formData.name.toLowerCase().trim() 
        && col.id !== column?.id
    );

    if (isDuplicate) {
      newErrors.name = 'A column with this name already exists';
    }

    // Name should be valid identifier (alphanumeric + underscore)
    if (formData.name && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.name)) {
      newErrors.name = 'Column name must start with letter/underscore and contain only letters, numbers, and underscores';
    }

    // Type is required
    if (!formData.type) {
      newErrors.type = 'Data type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleConstraintToggle = (constraintValue) => {
    const constraints = formData.constraints || [];
    const hasConstraint = constraints.includes(constraintValue);
    
    let newConstraints;
    if (hasConstraint) {
      // Remove constraint
      newConstraints = constraints.filter(c => c !== constraintValue);
    } else {
      // Add constraint
      newConstraints = [...constraints, constraintValue];
    }

    // If primary key is selected, make nullable false
    if (newConstraints.includes('primaryKey')) {
      handleChange('nullable', false);
    }

    handleChange('constraints', newConstraints);
  };

  const isPrimaryKey = (formData.constraints || []).includes('primaryKey');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Column Name */}
      <Input
        label="Column Name"
        type="text"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="e.g., customer_id"
        error={errors.name}
      />

      {/* Data Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className={`
            w-full px-4 py-3 rounded-lg border transition-colors
            focus:outline-none focus:ring-2
            ${errors.type
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
            }
          `}
        >
          {DATA_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-2 text-sm text-red-600">{errors.type}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description of this column..."
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Constraints (Multi-select checkboxes) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Constraints
        </label>
        <div className="space-y-2">
          {CONSTRAINT_TYPES.map((constraint) => (
            <div key={constraint.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={constraint.value}
                checked={(formData.constraints || []).includes(constraint.value)}
                onChange={() => handleConstraintToggle(constraint.value)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor={constraint.value} className="text-sm text-gray-700">
                {constraint.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Nullable Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="nullable"
          checked={formData.nullable}
          onChange={(e) => handleChange('nullable', e.target.checked)}
          disabled={isPrimaryKey}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label htmlFor="nullable" className={`text-sm ${isPrimaryKey ? 'text-gray-400' : 'text-gray-700'}`}>
          Allow NULL values {isPrimaryKey && '(disabled for Primary Keys)'}
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={onCancel}
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
  );
}

export default ColumnForm;