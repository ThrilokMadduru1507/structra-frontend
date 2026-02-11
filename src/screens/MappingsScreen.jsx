import PageHeader from '../components/PageHeader';

function MappingsScreen() {
  return (
    <div>
      <PageHeader
        title="Mappings"
        description="Create and manage source-to-target data mappings with transformation rules."
        icon="🔗"
        actions={[
          {
            label: 'Templates',
            icon: '📄',
            onClick: () => alert('Templates'),
            primary: false
          },
          {
            label: 'New Mapping',
            icon: '➕',
            onClick: () => alert('New Mapping'),
            primary: true
          }
        ]}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No Mappings Yet
        </h2>
        <p className="text-gray-600 mb-6">
          Create mappings to transform data between schemas.
        </p>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
          Create Your First Mapping
        </button>
      </div>
    </div>
  );
}

export default MappingsScreen;