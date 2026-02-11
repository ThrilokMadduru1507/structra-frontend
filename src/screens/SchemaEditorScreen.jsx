import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ObjectWorkspace from '../layouts/ObjectWorkspace';
import Modal from '../components/Modal';
import ColumnForm from '../components/ColumnForm';
import Button from '../components/Button';

function SchemaEditorScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Schema state
  const [schema, setSchema] = useState({
    id: id || 1,
    name: 'Customer Schema',
    version: '1.2',
    status: 'Draft',
    columns: [
      { id: 1, name: 'customer_id', type: 'INTEGER', nullable: false, constraints: ['primaryKey'], description: 'Unique customer identifier' },
      { id: 2, name: 'first_name', type: 'VARCHAR(50)', nullable: false, constraints: [], description: 'Customer first name' },
      { id: 3, name: 'last_name', type: 'VARCHAR(50)', nullable: false, constraints: [], description: 'Customer last name' },
      { id: 4, name: 'email', type: 'VARCHAR(100)', nullable: false, constraints: ['unique'], description: 'Customer email address' },
      { id: 5, name: 'phone', type: 'VARCHAR(20)', nullable: true, constraints: [], description: 'Contact phone number' },
      { id: 6, name: 'created_at', type: 'TIMESTAMP', nullable: false, constraints: [], description: 'Record creation timestamp' },
    ]
  });

  const [selectedColumn, setSelectedColumn] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [columnToEdit, setColumnToEdit] = useState(null);
  const [columnMenuOpen, setColumnMenuOpen] = useState(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (columnMenuOpen !== null) {
        setColumnMenuOpen(null);
      }
    };

    if (columnMenuOpen !== null) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [columnMenuOpen]);

  // Validation summary
  const getValidationSummary = () => {
    const warnings = [];
    
    schema.columns.forEach(col => {
      if (col.nullable && (col.constraints || []).includes('primaryKey')) {
        warnings.push({ column: col.name, message: 'Primary key should not be nullable' });
      }
      if (col.name.includes(' ')) {
        warnings.push({ column: col.name, message: 'Column name contains spaces' });
      }
      if (!col.description) {
        warnings.push({ column: col.name, message: 'Column has no description' });
      }
    });

    return {
      errors: [],
      warnings
    };
  };

  // Handlers
  const handleSave = () => {
    alert('Schema saved successfully!\n(Backend integration coming later)');
  };

  const handleExport = () => {
    const ddl = generateDDL(schema);
    alert(`Export Schema:\n\n${ddl}\n\n(Copy to clipboard feature coming next session)`);
  };

  const handleValidate = () => {
    const summary = getValidationSummary();
    const errorsCount = summary.errors.length;
    const warningsCount = summary.warnings.length;
    
    alert(
      `Validation Complete:\n\n` +
      `✓ ${schema.columns.length} columns validated\n` +
      `${errorsCount > 0 ? `❌ ${errorsCount} errors\n` : ''}` +
      `${warningsCount > 0 ? `⚠️ ${warningsCount} warnings` : '✓ No issues found'}`
    );
  };

  const handleAddColumn = (columnData) => {
    const newColumn = {
      id: Math.max(...schema.columns.map(c => c.id), 0) + 1,
      constraints: [],
      description: '',
      ...columnData
    };

    setSchema({
      ...schema,
      columns: [...schema.columns, newColumn]
    });

    setIsAddModalOpen(false);
    setSelectedColumn(newColumn);
  };

  const handleEditColumn = (columnData) => {
    setSchema({
      ...schema,
      columns: schema.columns.map(col =>
        col.id === columnToEdit.id ? { ...col, ...columnData } : col
      )
    });

    setIsEditModalOpen(false);
    setColumnToEdit(null);
    
    if (selectedColumn?.id === columnToEdit.id) {
      setSelectedColumn({ ...columnToEdit, ...columnData });
    }
  };

  const handleDeleteColumn = (column) => {
    if (confirm(`Are you sure you want to delete column "${column.name}"?`)) {
      setSchema({
        ...schema,
        columns: schema.columns.filter(col => col.id !== column.id)
      });

      if (selectedColumn?.id === column.id) {
        setSelectedColumn(null);
      }

      setColumnMenuOpen(null);
    }
  };

  const openEditModal = (column) => {
    setColumnToEdit(column);
    setIsEditModalOpen(true);
    setColumnMenuOpen(null);
  };

  const handleBack = () => {
    navigate('/schemas');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Schemas</span>
        </button>
      </div>

      {/* Object Workspace */}
      <ObjectWorkspace
        objectName={schema.name}
        objectType="schema"
        version={schema.version}
        status={schema.status}
        validationSummary={getValidationSummary()}
        onSave={handleSave}
        onExport={handleExport}
        onValidate={handleValidate}
        properties={
          selectedColumn ? (
            <ColumnProperties 
              column={selectedColumn}
              onEdit={() => openEditModal(selectedColumn)}
            />
          ) : (
            <SchemaProperties schema={schema} />
          )
        }
      >
        {/* Main Content: Schema Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Column Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Data Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Nullable
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Constraints
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schema.columns.map((column, index) => (
                    <tr
                      key={column.id}
                      onClick={() => setSelectedColumn(column)}
                      className={`cursor-pointer transition-colors ${
                        selectedColumn?.id === column.id
                          ? 'bg-indigo-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {column.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {column.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title={column.description}>
                        {column.description || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          column.nullable
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {column.nullable ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-1 flex-wrap">
                          {(column.constraints || []).map(constraint => (
                            <span 
                              key={constraint}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                constraint === 'primaryKey' ? 'bg-indigo-100 text-indigo-800' :
                                constraint === 'foreignKey' ? 'bg-purple-100 text-purple-800' :
                                constraint === 'unique' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {constraint === 'primaryKey' ? 'PK' :
                               constraint === 'foreignKey' ? 'FK' :
                               constraint === 'unique' ? 'UQ' : constraint}
                            </span>
                          ))}
                          {(!column.constraints || column.constraints.length === 0) && (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setColumnMenuOpen(columnMenuOpen === column.id ? null : column.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {columnMenuOpen === column.id && (
                          <>
                            {/* Invisible backdrop */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setColumnMenuOpen(null)}
                            />
                            
                            {/* Menu - positioned based on row index */}
                            <div className={`absolute ${index > 2 ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20`}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(column);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteColumn(column);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Column Button */}
          <div className="mt-4 inline-block">
            <Button
              variant="secondary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Column
            </Button>
          </div>
        </div>
      </ObjectWorkspace>

      {/* Add Column Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Column"
      >
        <ColumnForm
          existingColumns={schema.columns}
          onSave={handleAddColumn}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Column Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setColumnToEdit(null);
        }}
        title="Edit Column"
      >
        {columnToEdit && (
          <ColumnForm
            column={columnToEdit}
            existingColumns={schema.columns}
            onSave={handleEditColumn}
            onCancel={() => {
              setIsEditModalOpen(false);
              setColumnToEdit(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

// Helper function to generate DDL
function generateDDL(schema) {
  const columns = schema.columns.map(col => {
    const constraints = col.constraints || [];
    const parts = [
      `  ${col.name}`,
      col.type,
      col.nullable ? 'NULL' : 'NOT NULL',
      constraints.includes('primaryKey') ? 'PRIMARY KEY' : '',
      constraints.includes('unique') ? 'UNIQUE' : ''
    ];
    return parts.filter(Boolean).join(' ');
  });

  return `CREATE TABLE ${schema.name.toLowerCase().replace(/\s+/g, '_')} (\n${columns.join(',\n')}\n);`;
}

// Column Properties Component
function ColumnProperties({ column, onEdit }) {
  const constraints = column.constraints || [];
  const constraintLabels = {
    primaryKey: 'Primary Key',
    foreignKey: 'Foreign Key',
    unique: 'Unique'
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Column Name
        </label>
        <p className="text-sm font-medium text-gray-900">{column.name}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Data Type
        </label>
        <p className="text-sm text-gray-900">{column.type}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Description
        </label>
        <p className="text-sm text-gray-900">{column.description || 'No description'}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Nullable
        </label>
        <p className="text-sm text-gray-900">{column.nullable ? 'Yes' : 'No'}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Constraints
        </label>
        {constraints.length > 0 ? (
          <div className="space-y-1">
            {constraints.map(c => (
              <p key={c} className="text-sm text-gray-900">• {constraintLabels[c] || c}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">None</p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Button variant="primary" size="small" fullWidth onClick={onEdit}>
          Edit Column
        </Button>
      </div>
    </div>
  );
}

// Schema Properties Component
function SchemaProperties({ schema }) {
  const primaryKeys = schema.columns.filter(c => (c.constraints || []).includes('primaryKey'));
  const foreignKeys = schema.columns.filter(c => (c.constraints || []).includes('foreignKey'));
  const uniqueKeys = schema.columns.filter(c => (c.constraints || []).includes('unique'));
  const nullableColumns = schema.columns.filter(c => c.nullable);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Schema Name
        </label>
        <p className="text-sm font-medium text-gray-900">{schema.name}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Version
        </label>
        <p className="text-sm text-gray-900">v{schema.version}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Status
        </label>
        <p className="text-sm text-gray-900">{schema.status}</p>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Statistics
        </label>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Columns:</span>
            <span className="font-medium text-gray-900">{schema.columns.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Primary Keys:</span>
            <span className="font-medium text-gray-900">{primaryKeys.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Foreign Keys:</span>
            <span className="font-medium text-gray-900">{foreignKeys.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Unique Keys:</span>
            <span className="font-medium text-gray-900">{uniqueKeys.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nullable Columns:</span>
            <span className="font-medium text-gray-900">{nullableColumns.length}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Click a column to view its properties
        </p>
      </div>
    </div>
  );
}

export default SchemaEditorScreen;