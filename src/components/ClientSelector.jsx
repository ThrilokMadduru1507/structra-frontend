import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import { hierarchyAPI } from '../services/api';

function ClientSelector() {
  const navigate = useNavigate();
  const { selectedClient, selectClient, getCurrentClient } = useNavigation();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentClient = getCurrentClient();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await hierarchyAPI.getAllClients();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    if (clientId) {
      selectClient(clientId);
      navigate(`/clients/${clientId}`);
    } else {
      selectClient(null);
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-gray-500">Loading clients...</div>
    );
  }

  return (
    <div className="relative">
      <select
        value={currentClient?.id || ''}
        onChange={handleClientChange}
        className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
      >
        <option value="">Select Client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      
      {/* Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      
      {/* Dropdown arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default ClientSelector;