import { useNavigation } from '../context/NavigationContext';

function ErpSystemsScreen() {
  const { getCurrentClient, getCurrentCompany, availableErps, navigateToErp } = useNavigation();
  
  const client = getCurrentClient();
  const company = getCurrentCompany();

  if (!client || !company) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a client and company first</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ERP Systems</h1>
        <p className="text-gray-600">ERP systems for {company.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableErps.map((erp) => (
          <div
            key={erp.id}
            onClick={() => navigateToErp(erp.id)}
            className="bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-2xl">
                💼
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                v{erp.version}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
              {erp.name}
            </h3>
            
            <p className="text-sm text-gray-500 mb-3 font-mono">{erp.code}</p>
            
            <p className="text-gray-600 text-sm mb-4">
              {erp.description}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-500">
                <span className="flex items-center gap-1">
                  <span>📊</span>
                  {erp.businessFunctions.length} Business {erp.businessFunctions.length === 1 ? 'Function' : 'Functions'}
                </span>
              </div>
              <svg className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ErpSystemsScreen;