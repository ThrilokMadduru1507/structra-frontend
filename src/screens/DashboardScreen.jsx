import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Alert from '../components/Alert';

function DashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-xl font-bold text-indigo-600">
            Structra Studio
          </h1>

          {/* User Info + Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>

            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>

            <Button variant="secondary" size="small" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Alert */}
        <div className="mb-8">
          <Alert
            type="success"
            title={`Welcome back, ${user.name}!`}
            message="You are successfully logged in to Structra Studio."
            dismissible={false}
          />
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Your Account
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Name</span>
              <span className="text-gray-900 font-medium">{user.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Email</span>
              <span className="text-gray-900 font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Role</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 text-sm">User ID</span>
              <span className="text-gray-900 font-medium">#{user.id}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">0</p>
            <p className="text-sm text-gray-600">Projects</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">0</p>
            <p className="text-sm text-gray-600">Schemas</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">0</p>
            <p className="text-sm text-gray-600">Mappings</p>
          </div>
        </div>

        {/* Session Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Session Info
          </h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Your login is saved in localStorage. 
              Try refreshing the page — you'll stay logged in!
            </p>
          </div>

          <div className="mt-4 flex gap-3">
            <Button variant="danger" size="small" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardScreen;