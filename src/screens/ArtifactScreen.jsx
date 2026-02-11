import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import { diagramAPI } from '../services/api';

function ArtifactScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentClient, getCurrentCompany, getCurrentErp, getCurrentFunction } = useNavigation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const match = location.pathname.match(/\/functions\/\d+\/(\w+)$/);
    return match ? match[1] : null;
  };

  const clientId = getClientIdFromPath();
  const companyId = getCompanyIdFromPath();
  const erpId = getErpIdFromPath();
  const functionId = getFunctionIdFromPath();
  const artifactType = getArtifactTypeFromPath();

  const client = getCurrentClient();
  const company = getCurrentCompany();
  const erp = getCurrentErp();
  const func = getCurrentFunction();

  console.log('ArtifactScreen - artifactType:', artifactType);
  console.log('ArtifactScreen - func:', func);

  useEffect(() => {
    if (artifactType === 'diagrams' && func) {
      loadDiagrams();
    } else {
      // For other artifact types, show empty state
      setItems([]);
      setLoading(false);
    }
  }, [artifactType, func]);

  const loadDiagrams = async () => {
    try {
      setLoading(true);
      console.log('Loading diagrams for function:', func.id);
      const diagrams = await diagramAPI.getByFunction(func.id);
      console.log('Diagrams loaded:', diagrams);
      setItems(diagrams);
    } catch (error) {
      console.error('Error loading diagrams:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    if (artifactType === 'diagrams') {
      try {
        console.log('Creating new diagram for function:', func.id);
        // Create a new empty diagram
        const newDiagram = await diagramAPI.create(func.id, {
          name: `New Diagram - ${new Date().toLocaleDateString()}`,
          description: 'Click to edit description',
          content: {
            nodes: [],
            edges: []
          }
        });

        console.log('New diagram created:', newDiagram);

        // Navigate to the diagram editor
        navigate(`/clients/${clientId}/companies/${companyId}/erp/${erpId}/functions/${functionId}/diagrams/${newDiagram.id}`);
      } catch (error) {
        console.error('Error creating diagram:', error);
        alert('Failed to create diagram: ' + error.message);
      }
    } else {
      alert(`Creating new ${artifactType} - Coming soon!`);
    }
  };

  const handleOpenItem = (item) => {
    if (artifactType === 'diagrams') {
      navigate(`/clients/${clientId}/companies/${companyId}/erp/${erpId}/functions/${functionId}/diagrams/${item.id}`);
    } else {
      alert(`Opening ${artifactType} - Coming soon!`);
    }
  };

  const handleDeleteItem = async (item, e) => {
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      await diagramAPI.delete(item.id);
      // Reload diagrams
      loadDiagrams();
    } catch (error) {
      console.error('Error deleting diagram:', error);
      alert('Failed to delete diagram: ' + error.message);
    }
  };

  const artifactInfo = {
    diagrams: {
      name: 'Data Model Diagrams',
      icon: '📊',
      description: 'Visual ER diagrams and data models',
      createLabel: 'Create New Diagram'
    },
    models: {
      name: 'Data Models',
      icon: '🗂️',
      description: 'Structured data models and schemas',
      createLabel: 'Create New Model'
    },
    mappings: {
      name: 'S2T Mappings',
      icon: '🔄',
      description: 'Source-to-target field mappings',
      createLabel: 'Create New Mapping'
    },
    validations: {
      name: 'Data Validations',
      icon: '✅',
      description: 'Data quality rules and validations',
      createLabel: 'Create New Validation'
    },
    documentation: {
      name: 'Documentation',
      icon: '📚',
      description: 'Technical documentation and guides',
      createLabel: 'Create New Document'
    },
    metadata: {
      name: 'Business Metadata',
      icon: '🏷️',
      description: 'Business glossary and metadata',
      createLabel: 'Add New Metadata'
    }
  };

  const info = artifactInfo[artifactType];

  if (!info) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Artifact type not found</p>
      </div>
    );
  }

  if (!func) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Business function not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl">
            {info.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{info.name}</h1>
            <p className="text-gray-600">{info.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>📦 {func?.name}</span>
          <span>🏢 {erp?.name}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={`Search ${info.name.toLowerCase()}...`}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Filter</span>
            </button>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {info.createLabel}
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            All {info.name}
          </h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {info.name.toLowerCase()}...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">{info.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No {info.name} Yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first {info.name.toLowerCase()}</p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
            >
              {info.createLabel}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 Updated: {new Date(item.updated_at).toLocaleDateString()}</span>
                      <span>👤 {item.created_by_name || 'Unknown'}</span>
                      {item.content && item.content.nodes && (
                        <span>📊 {item.content.nodes.length} entities</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenItem(item);
                      }}
                      className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleDeleteItem(item, e)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtifactScreen;