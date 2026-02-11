import { useState } from 'react';
import Button from './Button';
import ColumnFormModal from './ColumnFormModal';

function EntityPropertiesPanel({ entity, onUpdateEntity, onDeleteEntity, onClose }) {
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [editingColumnIndex, setEditingColumnIndex] = useState(null);
  const [isColumnsExpanded, setIsColumnsExpanded] = useState(true);

  if (!entity) {
    return (
      <div className="p-6 text-center text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm font-medium">Select an entity to view properties</p>
      </div>
    );
  }

  const handleAddColumn = (columnData) => {
    const updatedColumns = [...(entity.data.columns || []), columnData];
    onUpdateEntity({
      ...entity,
      data: {
        ...entity.data,
        columns: updatedColumns
      }
    });
  };

  const handleEditColumn = (columnData) => {
    const updatedColumns = [...entity.data.columns];
    updatedColumns[editingColumnIndex] = columnData;
    onUpdateEntity({
      ...entity,
      data: {
        ...entity.data,
        columns: updatedColumns
      }
    });
    setEditingColumn(null);
    setEditingColumnIndex(null);
  };

  const handleDeleteColumn = (index) => {
    if (confirm('Are you sure you want to delete this column?')) {
      const updatedColumns = entity.data.columns.filter((_, i) => i !== index);
      onUpdateEntity({
        ...entity,
        data: {
          ...entity.data,
          columns: updatedColumns
        }
      });
    }
  };

  const openEditColumn = (column, index) => {
    setEditingColumn(column);
    setEditingColumnIndex(index);
    setIsColumnModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900">Entity Properties</h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          title="Close panel"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Entity Info Section */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-gray-900 mb-1">{entity.data.name}</h4>
              {entity.data.description && (
                <p className="text-sm text-gray-600">{entity.data.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Columns Section */}
        <div className="border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <button
              onClick={() => setIsColumnsExpanded(!isColumnsExpanded)}
              className="flex items-center gap-2 flex-1"
            >
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Columns ({entity.data.columns?.length || 0})
              </h4>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${isColumnsExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingColumn(null);
                setEditingColumnIndex(null);
                setIsColumnModalOpen(true);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold px-2 py-1 hover:bg-indigo-50 rounded ml-2"
            >
              + Add Column
            </button>
          </div>

          {isColumnsExpanded && (
            <div className="px-4 pb-4">
              {entity.data.columns?.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-500 mb-3">No columns defined</p>
                  <button
                    onClick={() => setIsColumnModalOpen(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    + Add your first column
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {entity.data.columns.map((column, index) => (
                    <div
                      key={index}
                      className="group p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {column.isPrimaryKey && (
                              <span className="text-base" title="Primary Key">🔑</span>
                            )}
                            {column.isForeignKey && !column.isPrimaryKey && (
                              <span className="text-base" title="Foreign Key">🔗</span>
                            )}
                            {!column.isPrimaryKey && !column.isForeignKey && (
                              <span className="text-base text-gray-400">●</span>
                            )}
                          </div>
                          
                          {/* Name & Type */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900 truncate">
                                {column.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                                {column.type}
                              </span>
                              {column.isNullable && (
                                <span className="text-xs text-gray-500">NULL</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditColumn(column, index)}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Edit column"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteColumn(index)}
                            className="p-1.5 hover:bg-red-100 rounded transition-colors"
                            title="Delete column"
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
        <Button
          variant="danger"
          fullWidth
          onClick={() => {
            if (confirm('Are you sure you want to delete this entity?')) {
              onDeleteEntity(entity.id);
            }
          }}
        >
          Delete Entity
        </Button>
      </div>

      {/* Column Modal */}
      <ColumnFormModal
        isOpen={isColumnModalOpen}
        onClose={() => {
          setIsColumnModalOpen(false);
          setEditingColumn(null);
          setEditingColumnIndex(null);
        }}
        onSave={editingColumn ? handleEditColumn : handleAddColumn}
        column={editingColumn}
        existingColumns={entity.data.columns || []}
      />
    </div>
  );
}

export default EntityPropertiesPanel;