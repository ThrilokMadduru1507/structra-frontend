function SettingsScreen() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="My Project" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows="3" placeholder="Project description..."></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsScreen;