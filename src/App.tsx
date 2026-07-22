import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingPage } from './pages/Loading'
import { LoginPage } from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { AssetRegistryPage } from './pages/AssetPage/AssetRegistryPage'
import { TaskMonitorPage } from './pages/TaskMonitor/TaskMonitor'
import ManageTaskPage from './pages/TaskMonitor/ManageTaskPage'
import { LostAndFoundPage } from './pages/LostandFound/LostAndFound'
import { IncidentReportPage } from './pages/IncidentReport/IncidentReporting'
import ProfileMain from './pages/Profile/ProfileMain'
import LogsMain from './pages/LogsModule/LogsMain'
import ManageProfileMain from './pages/ManageProfile/ManageProfileMain'
import UnauthorizedPage from './pages/UnauthorizedPage'
import ArchivesMain from './pages/ArchiveModule/ArchivesMain'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { ScannerPage } from './pages/ScannerPage'
import { AssetScanPage } from './pages/AssetScanPage'

// ======================================
// DEV MODE TOGGLE - SET TO FALSE TO DISABLE AUTH BYPASS
// ======================================
const DEV_MODE_SKIP_LOGIN = true;
// ======================================

function App() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
  const initApp = async () => {
    try {
      // ✅ DEV MODE: Auto-login with mock credentials (remove this block to require real login)
      if (DEV_MODE_SKIP_LOGIN) {
        localStorage.setItem('role', 'admin');
        localStorage.setItem('token', 'dev-mock-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify({ id: 'dev-user', name: 'Development User' }));
        console.log('🔓 DEV MODE ACTIVE: Login bypassed. Set DEV_MODE_SKIP_LOGIN to false to require authentication.');
      }
      
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

  if (isPageLoading) return <LoadingPage />;

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path='/' element={<Navigate to={DEV_MODE_SKIP_LOGIN ? "/dashboard" : "/login"} replace />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/qr-scanner' element={<ScannerPage />} />
        <Route path='/asset/scan/:assetId' element={<AssetScanPage />} />

        {/* protected routes */}
        <Route path='/dashboard' 
        element={
          <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path='/asset-registry'
        element={
          <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <AssetRegistryPage />
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
        <Route path='/manage-task'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
              <ManageTaskPage />
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
              <LogsMain />
          </ProtectedRoute>
        }
        />
        <Route path='/profile'
        element={
          <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <ProfileMain />
          </ProtectedRoute>
        }
        />
        <Route path='/manage-accounts'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
              <ManageProfileMain />
          </ProtectedRoute>
        }
        />
        <Route path='/archives'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
              <ArchivesMain />
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
 