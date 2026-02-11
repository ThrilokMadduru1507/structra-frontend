function DiagramToolbar({ 
  selectedTool, 
  onToolChange, 
  onAddEntity,
  onAutoLayout,
  onExport,
  onSave,
  onLoad
}) {
  const tools = [
    { id: 'select', icon: '👆', label: 'Select', shortcut: 'V' },
    { id: 'entity', icon: '📦', label: 'Add Entity', shortcut: 'E' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left: Tools */}
        <div className="flex items-center gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                if (tool.id === 'entity') {
                  onAddEntity();
                } else {
                  onToolChange(tool.id);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTool === tool.id
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100 hover:border-gray-300'
              }`}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <span className="text-lg">{tool.icon}</span>
              <span className="font-semibold">{tool.label}</span>
            </button>
          ))}

          <div className="h-8 w-px bg-gray-300 mx-2"></div>

          {/* Layout Tools */}
          <button
            onClick={onAutoLayout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all border-2 border-transparent hover:border-gray-300"
            title="Auto Layout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
            <span className="font-semibold">Auto Layout</span>
          </button>

          {onLoad && (
            <button
              onClick={onLoad}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all border-2 border-transparent hover:border-gray-300"
              title="Load Diagram"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="font-semibold">Load</span>
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all border-2 border-transparent hover:border-gray-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Diagram
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiagramToolbar;