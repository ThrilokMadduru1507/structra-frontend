import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';

function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const getArtifactTypeFromPath = () => {
    const match = location.pathname.match(/\/functions\/\d+\/(\w+)/);
    return match ? match[1] : null;
  };

  const getDiagramIdFromPath = () => {
    const match = location.pathname.match(/\/diagrams\/(\d+)/);
    return match ? match[1] : null;
  };

  const clientId = getClientIdFromPath();
  const companyId = getCompanyIdFromPath();
  const erpId = getErpIdFromPath();
  const functionId = getFunctionIdFromPath();
  const artifactType = getArtifactTypeFromPath();
  const diagramId = getDiagramIdFromPath();

  const client = getCurrentClient();
  const company = getCurrentCompany();
  const erp = getCurrentErp();
  const func = getCurrentFunction();

  const breadcrumbs = [];

  // Home
  breadcrumbs.push({
    label: 'Home',
    path: '/',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  });

  // Client
  if (client) {
    breadcrumbs.push({
      label: client.name,
      path: `/clients/${clientId}`
    });
  }

  // Company
  if (company) {
    breadcrumbs.push({
      label: company.name,
      path: `/clients/${clientId}/companies/${companyId}`
    });
  }

  // ERP
  if (erp) {
    breadcrumbs.push({
      label: erp.name,
      path: `/clients/${clientId}/companies/${companyId}/erp/${erpId}`
    });
  }

  // Function
  if (func) {
    breadcrumbs.push({
      label: func.name,
      path: `/clients/${clientId}/companies/${companyId}/erp/${erpId}/functions/${functionId}`
    });
  }

  // Artifact Type
  if (artifactType) {
    const artifactLabels = {
      diagrams: 'Data Model Diagrams',
      models: 'Data Models',
      mappings: 'S2T Mappings',
      validations: 'Data Validations',
      documentation: 'Documentation',
      metadata: 'Business Metadata'
    };
    
    breadcrumbs.push({
      label: artifactLabels[artifactType] || artifactType,
      path: `/clients/${clientId}/companies/${companyId}/erp/${erpId}/functions/${functionId}/${artifactType}`
    });
  }

  // Diagram Editor
  if (diagramId) {
    breadcrumbs.push({
      label: `Diagram ${diagramId}`,
      path: location.pathname,
      current: true
    });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg className="w-4 h-4 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {crumb.current ? (
            <span className="text-gray-900 font-semibold flex items-center gap-1">
              {crumb.icon}
              {crumb.label}
            </span>
          ) : (
            <button
              onClick={() => navigate(crumb.path)}
              className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
            >
              {crumb.icon}
              {crumb.label}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumb;