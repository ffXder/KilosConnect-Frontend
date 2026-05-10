import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingPage } from './pages/Loading'
import { LoginPage } from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { InventoryPage } from './pages//Inventory/InventoryPage'
import { TaskMonitorPage } from './pages/TaskMonitor/TaskMonitor'
import { LostAndFoundPage } from './pages/LostandFound/LostAndFound'
import { IncidentReportPage } from './pages/IncidentReport/IncidentReporting'
import { ProfilePage } from './pages/Profile/ProfileMain'
import { LogsPage } from './pages/LogsModule/LogsMain'
import { ManageAccountsPage } from './pages/ManageAccounts/ManageAccountPage'

function App() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
  const initApp = async () => {
    try {
      // only show loading on first load
      const hasVisited = sessionStorage.getItem('appLoaded');
      if (!hasVisited) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        sessionStorage.setItem('appLoaded', 'true');
      }
    } finally {
      setIsPageLoading(false);
    }
  };

    initApp();
  }, []);

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
        <Route path='/lost-and-found'
        element={
          <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <LostAndFoundPage />
          </ProtectedRoute>
        }
        />
        <Route path='/incident-report'
        element={
          <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <IncidentReportPage />
          </ProtectedRoute>
        }
        />
        <Route path='/audit-logs'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
              <LogsPage />
          </ProtectedRoute>
        }
        />
        <Route path='/profile'
        element={
          <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <ProfilePage />
          </ProtectedRoute>
        }
        />
        <Route path='/manage-accounts'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
              <ManageAccountsPage />
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
 