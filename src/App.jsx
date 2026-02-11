import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import AppShell from './layouts/AppShell';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import BusinessFunctionsScreen from './screens/BusinessFunctionsScreen';
import ArtifactScreen from './screens/ArtifactScreen';
import DiagramEditorScreen from './screens/DiagramEditorScreen';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public Route wrapper
function PublicRoute({ children }) {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Protected app wrapper - single NavigationProvider and AppShell
function ProtectedApp() {
  return (
    <NavigationProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/clients/:clientId" element={<HomeScreen />} />
          <Route path="/clients/:clientId/companies/:companyId" element={<HomeScreen />} />
          <Route path="/clients/:clientId/companies/:companyId/erp/:erpId" element={<HomeScreen />} />
          <Route path="/clients/:clientId/companies/:companyId/erp/:erpId/functions/:functionId" element={<BusinessFunctionsScreen />} />
          <Route path="/clients/:clientId/companies/:companyId/erp/:erpId/functions/:functionId/:artifactType" element={<ArtifactScreen />} />
          <Route path="/clients/:clientId/companies/:companyId/erp/:erpId/functions/:functionId/diagrams/:diagramId" element={<DiagramEditorScreen />} />
        </Routes>
      </AppShell>
    </NavigationProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginScreen />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <ProtectedApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;