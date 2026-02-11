import { useState } from 'react';
import Button from '../components/Button';

function ObjectWorkspace({ 
  objectName,
  objectType,      // 'schema', 'model', 'mapping'
  version,
  status,          // 'Draft', 'Active', 'Published'
  validationSummary,
  onSave,
  onExport,
  onValidate,
  children,        // Main content area
  properties       // Properties sidebar content
}) {
  const [showProperties, setShowProperties] = useState(true);

  // Status colors
  const statusColors = {
    Draft: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Active: 'bg-green-100 text-green-800 border-green-300',
    Published: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  return (
    <div className="h-full flex flex-col">
      {/* Object Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Object Info */}
          <div className="flex items-center gap-4">
            {/* Object Type Icon */}
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">
                {objectType === 'schema' && '📋'}
                {objectType === 'model' && '📊'}
                {objectType === 'mapping' && '🔗'}
              </span>
            </div>

            {/* Name & Version */}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">
                  {objectName}
                </h1>
                <span className="text-sm text-gray-500">v{version}</span>
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {objectType}
              </p>
            </div>

            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status]}`}>
              {status}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="small"
              onClick={onValidate}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Validate
            </Button>

            <Button
              variant="secondary"
              size="small"
              onClick={onExport}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </Button>

            <Button
              variant="primary"
              size="small"
              onClick={onSave}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
            </Button>

            {/* Properties Toggle */}
            <button
              onClick={() => setShowProperties(!showProperties)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle Properties Panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Summary Panel */}
      {validationSummary && (
        <ValidationPanel summary={validationSummary} />
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {children}
        </div>

        {/* Properties Sidebar */}
        {showProperties && properties && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Properties
              </h3>
              {properties}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Validation Panel Component
function ValidationPanel({ summary }) {
  const { errors = [], warnings = [] } = summary;
  const totalIssues = errors.length + warnings.length;

  if (totalIssues === 0) {
    return (
      <div className="bg-green-50 border-b border-green-200 px-6 py-3">
        <div className="flex items-center gap-2 text-green-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">No validation errors</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-4">
        {errors.length > 0 && (
          <div className="flex items-center gap-2 text-red-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{errors.length} error{errors.length !== 1 && 's'}</span>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="flex items-center gap-2 text-yellow-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{warnings.length} warning{warnings.length !== 1 && 's'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ObjectWorkspace;