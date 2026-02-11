import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hierarchyAPI } from '../services/api';

function HierarchicalNav() {
  const navigate = useNavigate();
  const params = useParams();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    loadClients();
  }, []);

  // Auto-expand based on current URL
  useEffect(() => {
    if (params.clientId) {
      setExpandedItems(prev => ({ ...prev, [`client-${params.clientId}`]: true }));
      loadClientData(params.clientId);
    }
    if (params.companyId) {
      setExpandedItems(prev => ({ ...prev, [`company-${params.companyId}`]: true }));
    }
    if (params.erpId) {
      setExpandedItems(prev => ({ ...prev, [`erp-${params.erpId}`]: true }));
    }
  }, [params.clientId, params.companyId, params.erpId]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await hierarchyAPI.getAllClients();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const loadClientData = async (clientId) => {
    try {
      const fullData = await hierarchyAPI.getClientHierarchy(clientId);
      
      // Update the client in the list with full hierarchy
      setClients(prev => prev.map(c => 
        c.id === parseInt(clientId) ? fullData : c
      ));
    } catch (error) {
      console.error('Error loading client hierarchy:', error);
    }
  };

  const toggleExpand = async (key, type, id) => {
    const newExpanded = !expandedItems[key];
    
    setExpandedItems(prev => ({
      ...prev,
      [key]: newExpanded
    }));

    // Load full data when expanding a client
    if (newExpanded && type === 'client') {
      await loadClientData(id);
    }
  };

  const isActive = (path) => {
    return window.location.pathname === path;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="p-4">
        <div className="text-sm text-gray-500 text-center">
          No clients available
        </div>
      </div>
    );
  }

  return (
    <nav className="p-4 space-y-1">
      {/* Home Link */}
      <div
        onClick={() => navigate('/')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          isActive('/') ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-sm font-medium">Home</span>
      </div>

      {/* Clients */}
      {clients.map((client) => {
        const clientKey = `client-${client.id}`;
        const isClientExpanded = expandedItems[clientKey];
        const companies = client.companies || [];

        return (
          <div key={client.id} className="space-y-1">
            {/* Client Level */}
            <div className="flex items-center">
              {companies.length > 0 && (
                <button
                  onClick={() => toggleExpand(clientKey, 'client', client.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isClientExpanded ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              <div
                onClick={() => navigate(`/clients/${client.id}`)}
                className={`flex-1 flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                  params.clientId === String(client.id) && !params.companyId
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium">{client.name}</span>
              </div>
            </div>

            {/* Companies */}
            {isClientExpanded && companies.length > 0 && (
              <div className="ml-6 space-y-1">
                {companies.map((company) => {
                  const companyKey = `company-${company.id}`;
                  const isCompanyExpanded = expandedItems[companyKey];
                  const erpSystems = company.erpSystems || [];

                  return (
                    <div key={company.id} className="space-y-1">
                      {/* Company Level */}
                      <div className="flex items-center">
                        {erpSystems.length > 0 && (
                          <button
                            onClick={() => toggleExpand(companyKey, 'company', company.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <svg
                              className={`w-4 h-4 text-gray-500 transition-transform ${
                                isCompanyExpanded ? 'rotate-90' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                        <div
                          onClick={() => navigate(`/clients/${client.id}/companies/${company.id}`)}
                          className={`flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-sm ${
                            params.companyId === String(company.id) && !params.erpId
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          🏛️ {company.name}
                        </div>
                      </div>

                      {/* ERP Systems */}
                      {isCompanyExpanded && erpSystems.length > 0 && (
                        <div className="ml-6 space-y-1">
                          {erpSystems.map((erp) => {
                            const erpKey = `erp-${erp.id}`;
                            const isErpExpanded = expandedItems[erpKey];
                            const functions = erp.businessFunctions || [];

                            return (
                              <div key={erp.id} className="space-y-1">
                                {/* ERP Level */}
                                <div className="flex items-center">
                                  {functions.length > 0 && (
                                    <button
                                      onClick={() => toggleExpand(erpKey, 'erp', erp.id)}
                                      className="p-1 hover:bg-gray-100 rounded"
                                    >
                                      <svg
                                        className={`w-4 h-4 text-gray-500 transition-transform ${
                                          isErpExpanded ? 'rotate-90' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>
                                  )}
                                  <div
                                    onClick={() => navigate(`/clients/${client.id}/companies/${company.id}/erp/${erp.id}`)}
                                    className={`flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-sm ${
                                      params.erpId === String(erp.id) && !params.functionId
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    💼 {erp.name}
                                  </div>
                                </div>

                                {/* Business Functions */}
                                {isErpExpanded && functions.length > 0 && (
                                  <div className="ml-6 space-y-1">
                                    {functions.map((func) => (
                                      <div
                                        key={func.id}
                                        onClick={() => navigate(`/clients/${client.id}/companies/${company.id}/erp/${erp.id}/functions/${func.id}`)}
                                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-sm ${
                                          params.functionId === String(func.id)
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'hover:bg-gray-100'
                                        }`}
                                      >
                                        <span>{func.icon}</span>
                                        <span className="text-sm">{func.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default HierarchicalNav;