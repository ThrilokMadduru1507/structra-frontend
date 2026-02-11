import { useNavigation } from '../context/NavigationContext';

function ContextInfo() {
  const {
    getCurrentClient,
    getCurrentCompany,
    getCurrentErp,
    getCurrentFunction
  } = useNavigation();

  const client = getCurrentClient();
  const company = getCurrentCompany();
  const erp = getCurrentErp();
  const func = getCurrentFunction();

  if (!client) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 px-6 py-3">
      <div className="flex items-center gap-3 text-sm">
        {/* Client */}
        {client && (
          <>
            <ContextItem
              icon="🏢"
              value={client.name}
              badge={client.code}
            />
            {company && <Separator />}
          </>
        )}
        
        {/* Company */}
        {company && (
          <>
            <ContextItem
              icon="🏛️"
              value={company.name}
              badge={company.code}
            />
            {erp && <Separator />}
          </>
        )}
        
        {/* ERP */}
        {erp && (
          <>
            <ContextItem
              icon="💼"
              value={erp.name}
              badge={`v${erp.version}`}
            />
            {func && <Separator />}
          </>
        )}
        
        {/* Function */}
        {func && (
          <ContextItem
            icon={func.icon}
            value={func.name}
            badge={func.code}
          />
        )}
      </div>
    </div>
  );
}

function ContextItem({ icon, value, badge }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
      {badge && (
        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
          {badge}
        </span>
      )}
    </div>
  );
}

function Separator() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default ContextInfo;