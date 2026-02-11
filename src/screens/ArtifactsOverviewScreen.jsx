import { useNavigation } from '../context/NavigationContext';
import { artifactTypes } from '../data/mockHierarchy';

function ArtifactsOverviewScreen() {
  const { getCurrentFunction, navigateToArtifact } = useNavigation();
  
  const func = getCurrentFunction();

  if (!func) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a business function</p>
      </div>
    );
  }

  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600 bg-indigo-100 text-indigo-700 border-indigo-200',
    blue: 'from-blue-500 to-blue-600 bg-blue-100 text-blue-700 border-blue-200',
    purple: 'from-purple-500 to-purple-600 bg-purple-100 text-purple-700 border-purple-200',
    green: 'from-green-500 to-green-600 bg-green-100 text-green-700 border-green-200',
    gray: 'from-gray-500 to-gray-600 bg-gray-100 text-gray-700 border-gray-200',
    orange: 'from-orange-500 to-orange-600 bg-orange-100 text-orange-700 border-orange-200',
    yellow: 'from-yellow-500 to-yellow-600 bg-yellow-100 text-yellow-700 border-yellow-200'
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Artifacts</h1>
        <p className="text-gray-600">Available artifacts for {func.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(artifactTypes).map((artifact) => {
          const artifactData = func.artifacts[artifact.id];
          const colorClass = colorClasses[artifact.color] || colorClasses.gray;
          
          return (
            <div
              key={artifact.id}
              onClick={() => navigateToArtifact(artifact.route)}
              className={`bg-white rounded-lg border-2 ${colorClass.split(' ')[3]} hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer p-6 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${colorClass.split(' ')[0]} rounded-xl flex items-center justify-center text-white text-3xl shadow-md`}>
                  {artifact.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{artifactData?.count || 0}</div>
                  <div className="text-xs text-gray-500">items</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {artifact.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {artifact.description}
              </p>

              {artifactData?.lastUpdated && (
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>Last updated</span>
                  <span className="font-medium">{formatDate(artifactData.lastUpdated)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default ArtifactsOverviewScreen;