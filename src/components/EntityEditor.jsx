import { useState } from 'react';
import Input from './Input';
import Button from './Button';

function EntityEditor({ entity, onSave, onClose }) {
  const [name, setName] = useState(entity.name || '');
  const [description, setDescription] = useState(entity.description || '');
  const [columns, setColumns] = useState(entity.columns || []);

  const handleAddColumn = () => {
    setColumns([
      ...columns,
      {
        name: 'new_column',
        type: 'VARCHAR(255)',
        isPrimaryKey: false,
        isNullable: true,
        isForeignKey: false,
      }
    ]);
  };

  const handleUpdateColumn = (index, field, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      [field]: value
    };
    setColumns(updatedColumns);
  };

  const handleDeleteColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      columns
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Entity</h2>
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Entity Name */}
            <div>
              <Input
                label="Entity Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Customer, Order, Product"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this entity..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
            </div>

            {/* Columns */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Columns
                </label>
                <button
                  onClick={handleAddColumn}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  Add Column
                </button>
              </div>

              <div className="space-y-3">
                {columns.map((column, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-12 gap-3">
                      {/* Column Name */}
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={column.name}
                          onChange={(e) => handleUpdateColumn(index, 'name', e.target.value)}
                          placeholder="Column name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                      </div>

                      {/* Data Type */}
                      <div className="col-span-3">
                        <select
                          value={column.type}
                          onChange={(e) => handleUpdateColumn(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                          <option value="INTEGER">INTEGER</option>
                          <option value="BIGINT">BIGINT</option>
                          <option value="VARCHAR(50)">VARCHAR(50)</option>
                          <option value="VARCHAR(100)">VARCHAR(100)</option>
                          <option value="VARCHAR(255)">VARCHAR(255)</option>
                          <option value="TEXT">TEXT</option>
                          <option value="DATE">DATE</option>
                          <option value="DATETIME">DATETIME</option>
                          <option value="TIMESTAMP">TIMESTAMP</option>
                          <option value="BOOLEAN">BOOLEAN</option>
                          <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                          <option value="FLOAT">FLOAT</option>
                        </select>
                      </div>

                      {/* Flags */}
                      <div className="col-span-4 flex items-center gap-3">
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={column.isPrimaryKey}
                            onChange={(e) => handleUpdateColumn(index, 'isPrimaryKey', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          PK
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={!column.isNullable}
                            onChange={(e) => handleUpdateColumn(index, 'isNullable', !e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          NOT NULL
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={column.isForeignKey}
                            onChange={(e) => handleUpdateColumn(index, 'isForeignKey', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          FK
                        </label>
                      </div>

                      {/* Delete */}
                      <div className="col-span-1 flex items-center justify-end">
                        <button
                          onClick={() => handleDeleteColumn(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {columns.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No columns defined. Click "Add Column" to get started.
                  </div>
                )}
              </div>
            </div>
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

export default EntityEditor;