function ValidationScreen() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Validation</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Design-Time Validation</h2>
        <p className="text-gray-600">Check your transformations for errors and warnings.</p>
      </div>
    </div>
  );
}

export default ValidationScreen;