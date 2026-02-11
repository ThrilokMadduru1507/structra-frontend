import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

function ExportModal({ isOpen, onClose, onExport }) {
  const [exportType, setExportType] = useState('png');
  const [includeBackground, setIncludeBackground] = useState(true);
  const [fileName, setFileName] = useState('diagram');

  const exportOptions = [
    {
      id: 'png',
      name: 'PNG Image',
      icon: '🖼️',
      description: 'Raster image format, best for sharing',
      extension: '.png'
    },
    {
      id: 'svg',
      name: 'SVG Vector',
      icon: '📐',
      description: 'Scalable vector graphics, best for printing',
      extension: '.svg'
    },
    {
      id: 'json',
      name: 'JSON Data',
      icon: '💾',
      description: 'Save diagram to reload later',
      extension: '.json'
    },
    {
      id: 'ddl',
      name: 'SQL DDL',
      icon: '📋',
      description: 'Generate CREATE TABLE statements',
      extension: '.sql'
    }
  ];

  const handleExport = () => {
    onExport(exportType, { includeBackground, fileName });
    onClose();
  };

  const selectedOption = exportOptions.find(opt => opt.id === exportType);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Diagram"
    >
      <div className="space-y-4">
        {/* Export Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="space-y-2">
            {exportOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  exportType === option.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="exportType"
                  value={option.id}
                  checked={exportType === option.id}
                  onChange={(e) => setExportType(e.target.value)}
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{option.icon}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {option.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* File Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File Name
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="diagram"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-500 font-mono">
              {selectedOption?.extension}
            </span>
          </div>
        </div>

        {/* Options for PNG/SVG */}
        {(exportType === 'png' || exportType === 'svg') && (
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeBackground}
                onChange={(e) => setIncludeBackground(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                Include background grid
              </span>
            </label>
          </div>
        )}

        {/* Preview Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-gray-700 font-medium mb-1">
                {selectedOption?.name}
              </p>
              <p className="text-xs text-gray-600">
                {exportType === 'png' && 'Image will be downloaded as a PNG file. Best for presentations and documentation.'}
                {exportType === 'svg' && 'Vector image will be downloaded. Can be scaled to any size without quality loss.'}
                {exportType === 'json' && 'Diagram structure will be saved as JSON. You can reload this file later to continue editing.'}
                {exportType === 'ddl' && 'SQL CREATE TABLE statements will be generated for all entities in your diagram.'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleExport}
          >
            Export {selectedOption?.name}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ExportModal;