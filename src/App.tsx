import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingPage } from './pages/Loading'
import { LoginPage } from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { InventoryPage } from './pages/Inventory'
import { TaskMonitorPage } from './pages/TaskMonitor'

function App() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      } finally {
        setIsPageLoading(false);
      }
    };

    initApp();
  }, []);

  if (isPageLoading) {
    return <LoadingPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' 
        element={
          <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path='/inventory'
        element={
          <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <InventoryPage />
          </ProtectedRoute>
        }
        />
        <Route path='/task-monitor'
        element={
          <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <TaskMonitorPage />
          </ProtectedRoute>
        }
        />
      {/* redirects to login if not found or authenticated */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  
  );
}

export default App
 