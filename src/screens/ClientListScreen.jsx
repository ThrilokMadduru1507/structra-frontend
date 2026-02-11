import { useNavigation } from '../context/NavigationContext';

function ClientListScreen() {
  const { availableClients, navigateToClient } = useNavigation();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
        <p className="text-gray-600">Select a client to view their companies and systems</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableClients.map((client) => (
          <div
            key={client.id}
            onClick={() => navigateToClient(client.id)}
            className="bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                  {/* Building */}
                  <rect x="4" y="6" width="24" height="36" fill="#A78BFA" stroke="#A78BFA" strokeWidth="2"/>
                  <rect x="10" y="2" width="12" height="6" fill="#A78BFA"/>
                  
                  {/* Windows */}
                  <rect x="8" y="12" width="6" height="2" fill="#E9D5FF"/>
                  <rect x="18" y="12" width="6" height="2" fill="#E9D5FF"/>
                  <rect x="8" y="18" width="6" height="2" fill="#E9D5FF"/>
                  <rect x="18" y="18" width="6" height="2" fill="#E9D5FF"/>
                  <rect x="8" y="24" width="6" height="2" fill="#E9D5FF"/>
                  <rect x="18" y="24" width="6" height="2" fill="#E9D5FF"/>
                  <rect x="8" y="30" width="6" height="2" fill="#E9D5FF"/>
                  <rect x="18" y="30" width="6" height="2" fill="#E9D5FF"/>
                  
                  {/* Base */}
                  <rect x="2" y="40" width="28" height="4" fill="#A78BFA"/>
                  
                  {/* Person - Head */}
                  <circle cx="38" cy="24" r="5" stroke="#A78BFA" strokeWidth="2" fill="none"/>
                  
                  {/* Person - Body */}
                  <path d="M 28 42 Q 28 36 33 34 L 33 34 Q 38 34 38 34 Q 43 34 43 34 L 43 34 Q 48 36 48 42 Z" fill="#A78BFA"/>
                </svg>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                {client.code}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {client.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              {client.description}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {client.companies.length} {client.companies.length === 1 ? 'Company' : 'Companies'}
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

export default ClientListScreen;