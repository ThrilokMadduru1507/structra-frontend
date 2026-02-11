import { useNavigate, useLocation } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';

function BusinessFunctionsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentClient, getCurrentCompany, getCurrentErp, getCurrentFunction } = useNavigation();

  // Parse IDs from URL
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

  const getFunctionIdFromPath = () => {
    const match = location.pathname.match(/\/functions\/(\d+)/);
    return match ? match[1] : null;
  };

  const clientId = getClientIdFromPath();
  const companyId = getCompanyIdFromPath();
  const erpId = getErpIdFromPath();
  const functionId = getFunctionIdFromPath();

  const client = getCurrentClient();
  const company = getCurrentCompany();
  const erp = getCurrentErp();
  const func = getCurrentFunction();

  console.log('BusinessFunctionsScreen - func:', func);

  if (!func) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Business function not found</p>
      </div>
    );
  }

  const artifacts = func.artifacts || {};

  // Artifact type configurations
  const artifactTypes = [
    {
      id: 'diagrams',
      name: 'Data Model Diagrams',
      icon: '📊',
      description: 'Visual ER diagrams and data models',
      gradient: 'from-blue-500 to-cyan-500',
      count: artifacts.diagrams?.count || 0
    },
    {
      id: 'models',
      name: 'Data Models',
      icon: '🗂️',
      description: 'Structured data models and schemas',
      gradient: 'from-purple-500 to-pink-500',
      count: artifacts.dataModels?.count || 0
    },
    {
      id: 'mappings',
      name: 'S2T Mappings',
      icon: '🔄',
      description: 'Source-to-target field mappings',
      gradient: 'from-green-500 to-teal-500',
      count: artifacts.s2tMappings?.count || 0
    },
    {
      id: 'validations',
      name: 'Data Validations',
      icon: '✅',
      description: 'Data quality rules and validations',
      gradient: 'from-orange-500 to-red-500',
      count: artifacts.dataValidations?.count || 0
    },
    {
      id: 'documentation',
      name: 'Documentation',
      icon: '📚',
      description: 'Technical documentation and guides',
      gradient: 'from-indigo-500 to-purple-500',
      count: artifacts.documentation?.count || 0
    },
    {
      id: 'metadata',
      name: 'Business Metadata',
      icon: '🏷️',
      description: 'Business glossary and metadata',
      gradient: 'from-pink-500 to-rose-500',
      count: artifacts.businessMetadata?.count || 0
    }
  ];

  const handleArtifactClick = (artifactType) => {
    navigate(`/clients/${clientId}/companies/${companyId}/erp/${erpId}/functions/${functionId}/${artifactType}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl">
            {func.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{func.name}</h1>
            <p className="text-gray-600">{func.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>📦 {func.code}</span>
          <span>🏢 {erp?.name}</span>
          <span>🏛️ {company?.name}</span>
        </div>
      </div>

      {/* Artifact Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artifactTypes.map((artifact) => (
          <div
            key={artifact.id}
            onClick={() => handleArtifactClick(artifact.id)}
            className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${artifact.gradient} rounded-xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
              {artifact.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{artifact.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{artifact.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-indigo-600">{artifact.count}</span>
              <span className="text-sm text-gray-500">items</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusinessFunctionsScreen;