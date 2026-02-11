// Mock hierarchical data structure
// Client → Company → ERP System → Business Function → Artifacts

const mockHierarchy = {
  clients: [
    {
      id: 'client-1',
      name: 'Acme Corporation',
      code: 'ACME',
      description: 'Global manufacturing and distribution',
      companies: [
        {
          id: 'company-1',
          name: 'Acme Corporation', // Same as client for single company
          code: 'ACME-CORP',
          description: 'Main entity',
          erpSystems: [
            {
              id: 'erp-1',
              name: 'SAP S/4HANA',
              code: 'SAP',
              version: '2023',
              description: 'Enterprise resource planning system',
              businessFunctions: [
                {
                  id: 'func-1',
                  name: 'Sales & Operations',
                  code: 'SD-MM',
                  description: 'Sales order management and operations',
                  icon: '📦',
                  color: 'blue',
                  artifacts: {
                    diagrams: { count: 12, lastUpdated: '2024-01-15' },
                    models: { count: 45, lastUpdated: '2024-01-20' },
                    mappings: { count: 78, lastUpdated: '2024-01-25' },
                    validations: { count: 34, lastUpdated: '2024-01-22' },
                    documentation: { count: 23, lastUpdated: '2024-01-18' },
                    metadata: { count: 56, lastUpdated: '2024-01-28' }
                  }
                },
                {
                  id: 'func-2',
                  name: 'Purchase & Procurement',
                  code: 'MM',
                  description: 'Procurement and materials management',
                  icon: '🛒',
                  color: 'green',
                  artifacts: {
                    diagrams: { count: 8, lastUpdated: '2024-01-12' },
                    models: { count: 32, lastUpdated: '2024-01-19' },
                    mappings: { count: 56, lastUpdated: '2024-01-24' },
                    validations: { count: 28, lastUpdated: '2024-01-21' },
                    documentation: { count: 15, lastUpdated: '2024-01-17' },
                    metadata: { count: 42, lastUpdated: '2024-01-26' }
                  }
                },
                {
                  id: 'func-3',
                  name: 'Inventory Management',
                  code: 'WM',
                  description: 'Warehouse and inventory operations',
                  icon: '📊',
                  color: 'purple',
                  artifacts: {
                    diagrams: { count: 10, lastUpdated: '2024-01-14' },
                    models: { count: 38, lastUpdated: '2024-01-21' },
                    mappings: { count: 64, lastUpdated: '2024-01-26' },
                    validations: { count: 31, lastUpdated: '2024-01-23' },
                    documentation: { count: 19, lastUpdated: '2024-01-19' },
                    metadata: { count: 48, lastUpdated: '2024-01-27' }
                  }
                },
                {
                  id: 'func-4',
                  name: 'Financials',
                  code: 'FI-CO',
                  description: 'Financial accounting and controlling',
                  icon: '💰',
                  color: 'yellow',
                  artifacts: {
                    diagrams: { count: 15, lastUpdated: '2024-01-16' },
                    models: { count: 52, lastUpdated: '2024-01-22' },
                    mappings: { count: 89, lastUpdated: '2024-01-27' },
                    validations: { count: 42, lastUpdated: '2024-01-24' },
                    documentation: { count: 28, lastUpdated: '2024-01-20' },
                    metadata: { count: 67, lastUpdated: '2024-01-29' }
                  }
                }
              ]
            },
            {
              id: 'erp-2',
              name: 'Oracle Cloud ERP',
              code: 'ORACLE',
              version: '23C',
              description: 'Cloud-based ERP solution',
              businessFunctions: [
                {
                  id: 'func-5',
                  name: 'Financials',
                  code: 'GL-AP-AR',
                  description: 'General ledger and accounts',
                  icon: '💰',
                  color: 'yellow',
                  artifacts: {
                    diagrams: { count: 9, lastUpdated: '2024-01-13' },
                    models: { count: 28, lastUpdated: '2024-01-18' },
                    mappings: { count: 45, lastUpdated: '2024-01-23' },
                    validations: { count: 22, lastUpdated: '2024-01-20' },
                    documentation: { count: 14, lastUpdated: '2024-01-16' },
                    metadata: { count: 35, lastUpdated: '2024-01-25' }
                  }
                }
              ]
            }
          ]
        },
        {
          id: 'company-2',
          name: 'Acme Europe GmbH',
          code: 'ACME-EU',
          description: 'European operations',
          erpSystems: [
            {
              id: 'erp-3',
              name: 'SAP S/4HANA',
              code: 'SAP',
              version: '2023',
              description: 'Enterprise resource planning system',
              businessFunctions: [
                {
                  id: 'func-6',
                  name: 'Sales & Operations',
                  code: 'SD',
                  description: 'European sales operations',
                  icon: '📦',
                  color: 'blue',
                  artifacts: {
                    diagrams: { count: 7, lastUpdated: '2024-01-11' },
                    models: { count: 25, lastUpdated: '2024-01-17' },
                    mappings: { count: 42, lastUpdated: '2024-01-22' },
                    validations: { count: 19, lastUpdated: '2024-01-19' },
                    documentation: { count: 12, lastUpdated: '2024-01-15' },
                    metadata: { count: 31, lastUpdated: '2024-01-24' }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'client-2',
      name: 'TechVentures Inc',
      code: 'TECH',
      description: 'Technology and innovation company',
      companies: [
        {
          id: 'company-3',
          name: 'TechVentures Inc', // Same as client
          code: 'TECH-MAIN',
          description: 'Main entity',
          erpSystems: [
            {
              id: 'erp-4',
              name: 'Workday',
              code: 'WDAY',
              version: '2024',
              description: 'Cloud ERP for finance and HR',
              businessFunctions: [
                {
                  id: 'func-7',
                  name: 'Financials',
                  code: 'FIN',
                  description: 'Financial management',
                  icon: '💰',
                  color: 'yellow',
                  artifacts: {
                    diagrams: { count: 6, lastUpdated: '2024-01-10' },
                    models: { count: 22, lastUpdated: '2024-01-16' },
                    mappings: { count: 38, lastUpdated: '2024-01-21' },
                    validations: { count: 17, lastUpdated: '2024-01-18' },
                    documentation: { count: 10, lastUpdated: '2024-01-14' },
                    metadata: { count: 28, lastUpdated: '2024-01-23' }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Artifact type definitions with icons and colors
export const artifactTypes = {
  diagrams: {
    id: 'diagrams',
    name: 'Data Model Diagrams',
    icon: '📊',
    color: 'indigo',
    description: 'Visual ER diagrams and data models',
    route: 'diagrams'
  },
  models: {
    id: 'models',
    name: 'Data Models',
    icon: '🗂️',
    color: 'blue',
    description: 'Structured data model definitions',
    route: 'models'
  },
  mappings: {
    id: 'mappings',
    name: 'S2T Mappings',
    icon: '🔗',
    color: 'purple',
    description: 'Source-to-target mapping specifications',
    route: 'mappings'
  },
  validations: {
    id: 'validations',
    name: 'Data Validations',
    icon: '✓',
    color: 'green',
    description: 'Validation rules and quality checks',
    route: 'validations'
  },
  documentation: {
    id: 'documentation',
    name: 'Documentation',
    icon: '📄',
    color: 'gray',
    description: 'Technical and business documentation',
    route: 'documentation'
  },
  metadata: {
    id: 'metadata',
    name: 'Business Metadata',
    icon: '🏷️',
    color: 'orange',
    description: 'Business context and metadata',
    route: 'metadata'
  }
};

// Helper functions to navigate hierarchy
export const findClient = (clientId) => {
  return mockHierarchy.clients.find(c => c.id === clientId);
};

export const findCompany = (clientId, companyId) => {
  const client = findClient(clientId);
  return client?.companies.find(c => c.id === companyId);
};

export const findErpSystem = (clientId, companyId, erpId) => {
  const company = findCompany(clientId, companyId);
  return company?.erpSystems.find(e => e.id === erpId);
};

export const findBusinessFunction = (clientId, companyId, erpId, functionId) => {
  const erp = findErpSystem(clientId, companyId, erpId);
  return erp?.businessFunctions.find(f => f.id === functionId);
};

export default mockHierarchy;