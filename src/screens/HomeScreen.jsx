import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';

function HomeScreen() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { hierarchyData, loading } = useNavigation();

  // Parse IDs from URL path
  const getClientIdFromPath = () => {
    const match = location.pathname.match(/\/clients\/(\d+)/);
    return match ? match[1] : null;
  };

  const getCompanyIdFromPath = () => {
    const match = location.pathname.match(/\/companies\/(\d+)/);
    return match ? match[1] : null;
  };

  const getErpIdFromPath = () => {
    const match = location.pathname.match(/\/erp\/(\d+)/);
    return match ? match[1] : null;
  };

  const clientId = params.clientId || getClientIdFromPath();
  const companyId = params.companyId || getCompanyIdFromPath();
  const erpId = params.erpId || getErpIdFromPath();

  console.log('HomeScreen - location:', location.pathname);
  console.log('HomeScreen - clientId:', clientId);
  console.log('HomeScreen - companyId:', companyId);
  console.log('HomeScreen - erpId:', erpId);
  console.log('HomeScreen - hierarchyData:', hierarchyData);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show ERP's business functions
  if (hierarchyData && clientId && companyId && erpId) {
    const company = hierarchyData.companies?.find(c => c.id === parseInt(companyId));
    const erp = company?.erpSystems?.find(e => e.id === parseInt(erpId));

    if (!erp) {
      return <div className="p-6 text-center text-gray-600">ERP system not found</div>;
    }

    const functions = erp.businessFunctions || [];

    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{erp.name}</h1>
          <p className="text-gray-600">{erp.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>🏢 {erp.vendor}</span>
            <span>📦 v{erp.version}</span>
            <span>🔧 {erp.environment}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Business Functions</h2>
            <span className="text-sm text-gray-500">{functions.length} functions</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {functions.map((func) => {
              const artifacts = func.artifacts || {};
              const totalArtifacts = Object.values(artifacts).reduce(
                (sum, artifact) => sum + (artifact.count || 0), 
                0
              );
              
              return (
                <div
                  key={func.id}
                  onClick={() => navigate(`/clients/${clientId}/companies/${companyId}/erp/${erpId}/functions/${func.id}`)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                      {func.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{func.name}</h3>
                      <p className="text-xs text-gray-500">{func.code}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{func.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">📊 {totalArtifacts} artifacts</span>
                    <span className="text-indigo-600 font-semibold">View →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Show company's ERP systems
  if (hierarchyData && clientId && companyId && !erpId) {
    const company = hierarchyData.companies?.find(c => c.id === parseInt(companyId));

    if (!company) {
      return <div className="p-6 text-center text-gray-600">Company not found</div>;
    }

    const erpSystems = company.erpSystems || [];

    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
          <p className="text-gray-600">{company.description}</p>
          <p className="text-sm text-gray-500 mt-1">📍 {company.location}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">ERP Systems</h2>
            <span className="text-sm text-gray-500">{erpSystems.length} systems</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {erpSystems.map((erpSystem) => (
              <div
                key={erpSystem.id}
                onClick={() => navigate(`/clients/${clientId}/companies/${companyId}/erp/${erpSystem.id}`)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
                    💼
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{erpSystem.name}</h3>
                    <p className="text-xs text-gray-500">{erpSystem.vendor}</p>
                  </div>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                    v{erpSystem.version}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{erpSystem.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>📦 {erpSystem.businessFunctions?.length || 0} functions</span>
                  <span>🔧 {erpSystem.environment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show client's companies
  if (hierarchyData && clientId && !companyId) {
    const companies = hierarchyData.companies || [];

    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{hierarchyData.name}</h1>
          <p className="text-gray-600">{hierarchyData.description}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Companies</h2>
            <span className="text-sm text-gray-500">{companies.length} companies</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((companyItem) => (
              <div
                key={companyItem.id}
                onClick={() => navigate(`/clients/${clientId}/companies/${companyItem.id}`)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">
                    🏛️
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{companyItem.name}</h3>
                    <p className="text-xs text-gray-500">{companyItem.code}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{companyItem.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>📍 {companyItem.location}</span>
                  <span>💼 {companyItem.erpSystems?.length || 0} ERP systems</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default: Beautiful Structra Home Page (NO CLIENT SELECTED)
  return (
    // ... (keep the same default home page content)
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">
          Structra Studio
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          A design-first, metadata-driven data transformation studio
        </p>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Select a client from the dropdown menu above to begin working with your data transformation projects.
        </p>
      </div>
    </div>
  );
}

export default HomeScreen;