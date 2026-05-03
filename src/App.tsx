import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingPage } from './pages/Loading'
import { LoginPage } from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { InventoryPage } from './pages/Inventory'
import { TaskMonitorPage } from './pages/TaskMonitor'
import { LostAndFoundPage } from './pages/LostAndFound'
import { IncidentReportPage } from './pages/IncidentReport'
import { LogsPage } from './pages/Logs'

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

      {/* redirects to login if not found or authenticated */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  
  );
}

export default App
 