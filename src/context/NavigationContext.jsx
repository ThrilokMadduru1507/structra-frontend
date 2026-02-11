import { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { hierarchyAPI } from '../services/api';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const params = useParams();
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState(null);
  const [hierarchyData, setHierarchyData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Parse clientId from URL path
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

  const clientId = params.clientId || getClientIdFromPath();
  const companyId = params.companyId || getCompanyIdFromPath();
  const erpId = params.erpId || getErpIdFromPath();
  const functionId = params.functionId || getFunctionIdFromPath();

  console.log('NavigationContext - location:', location.pathname);
  console.log('NavigationContext - clientId:', clientId);
  console.log('NavigationContext - hierarchyData:', hierarchyData);

  // Load hierarchy data when client changes
  useEffect(() => {
    if (clientId) {
      console.log('Loading hierarchy for client:', clientId);
      loadClientHierarchy(clientId);
    } else {
      // Clear hierarchy when no client selected
      setHierarchyData(null);
      setSelectedClient(null);
    }
  }, [clientId]);

  const loadClientHierarchy = async (clientId) => {
    try {
      setLoading(true);
      console.log('Fetching hierarchy for client:', clientId);
      const data = await hierarchyAPI.getClientHierarchy(clientId);
      console.log('Hierarchy data loaded:', data);
      setHierarchyData(data);
      setSelectedClient(clientId);
    } catch (error) {
      console.error('Error loading hierarchy:', error);
      setHierarchyData(null);
    } finally {
      setLoading(false);
    }
  };

  const selectClient = (clientId) => {
    setSelectedClient(clientId);
  };

  const getCurrentClient = () => {
    if (!clientId || !hierarchyData) return null;
    return hierarchyData;
  };

  const getCurrentCompany = () => {
    if (!hierarchyData || !companyId) return null;
    const companies = hierarchyData.companies || [];
    return companies.find(c => c.id === parseInt(companyId));
  };

  const getCurrentErp = () => {
    const company = getCurrentCompany();
    if (!company || !erpId) return null;
    const erpSystems = company.erpSystems || [];
    return erpSystems.find(e => e.id === parseInt(erpId));
  };

  const getCurrentFunction = () => {
    const erp = getCurrentErp();
    if (!erp || !functionId) return null;
    const functions = erp.businessFunctions || [];
    return functions.find(f => f.id === parseInt(functionId));
  };

  const value = {
    selectedClient,
    selectClient,
    getCurrentClient,
    getCurrentCompany,
    getCurrentErp,
    getCurrentFunction,
    hierarchyData,
    loading,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}