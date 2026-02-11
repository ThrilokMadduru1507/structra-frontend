import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';

function SchemasScreen() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Schemas"
        description="Define and manage your data schemas. Import from databases, files, or create custom schemas."
        icon="📋"
        actions={[
          {
            label: 'Import Schema',
            icon: '📥',
            onClick: () => alert('Import Schema'),
            primary: true
          }
        ]}
      />

      {/* Example Schema Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/schemas/1')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Customer Schema</h3>
              <p className="text-xs text-gray-500">v1.2 • Draft</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Customer data structure with contact information
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>6 columns</span>
            <span>•</span>
            <span>Updated 2d ago</span>
          </div>
        </div>

        {/* Add more schema cards here later */}
      </div>

      {/* Or Empty State */}
      {false && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Schemas Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Import or create schemas to define your data structures.
          </p>
          <Button variant="primary">
            Import Your First Schema
          </Button>
        </div>
      )}
    </div>
  );
}

export default SchemasScreen;