import { useNavigation } from '../context/NavigationContext';

function CompanyListScreen() {
  const { getCurrentClient, availableCompanies, navigateToCompany } = useNavigation();
  
  const client = getCurrentClient();

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a client first</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies</h1>
        <p className="text-gray-600">Companies under {client.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCompanies.map((company) => (
          <div
            key={company.id}
            onClick={() => navigateToCompany(company.id)}
            className="bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-2xl">
                🏛️
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                {company.code}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {company.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              {company.description}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-500">
                <span className="flex items-center gap-1">
                  <span>💼</span>
                  {company.erpSystems.length} ERP {company.erpSystems.length === 1 ? 'System' : 'Systems'}
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

export default CompanyListScreen;