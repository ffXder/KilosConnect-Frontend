// imports
import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingPage } from './components/Loading'
import ProtectedRoute from './components/ProtectedRoute'

// auth 
import { LoginPage } from './pages/auth/Login'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'

// shared/public pages
import UnauthorizedPage from './pages/UnauthorizedPage'
import { ScannerPage } from './pages/ScannerPage'
import { AssetScanPage } from './pages/AssetScanPage'
import { ProfilePage } from './pages/admin/Profile/ProfileMain'

// admin pages
import { DashboardPage } from './pages/admin/Dashboard/DashboardPage'
import { AssetRegistryPage } from './pages/admin/AssetPage/AssetRegistryPage'
import { TaskMonitorPage } from './pages/admin/TaskMonitor/TaskMonitorPage'
import { TaskManagementPage } from './pages/admin/TaskManager/TaskManagementPage'
import { LostAndFoundPage } from './pages/admin/LostandFound/LostAndFound'
import { IncidentReportPage } from './pages/admin/IncidentReport/IncidentReporting'
import { LogsPage } from './pages/admin/LogsModule/LogsMain'
import { ManageAccountsPage } from './pages/admin/ManageAccounts/ManageAccountPage'
import ArchivePage from './pages/admin/Archives'

// custodian pages
import CustodianDashboardPage from './pages/custodian/Dashboard/DashboardPage'
import ScanQRPage from './pages/custodian/ScanQR/ScanQRPage'
import BuddySystemPage from './pages/custodian/BuddySystem/BuddySystemPage'
import TaskMain from './pages/custodian/TaskOperation/TaskOperationPage'

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

  if (isPageLoading) return <LoadingPage />;

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/qr-scanner' element={<ScannerPage />} />
        <Route path='/asset/scan/:assetId' element={<AssetScanPage />} />

        {/* SHARED PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'custodian']} />}>
          <Route path="/asset-registry" element={<AssetRegistryPage />} />
          <Route path="/lost-and-found" element={<LostAndFoundPage />} />
          <Route path="/incident-report" element={<IncidentReportPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* ADMIN ONLY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/task-monitor" element={<TaskMonitorPage />} />
          <Route path="/manage-task" element={<TaskManagementPage />} />
          <Route path="/audit-logs" element={<LogsPage />} />
          <Route path="/manage-accounts" element={<ManageAccountsPage />} />
          <Route path="/archives" element={<ArchivePage />} />
        </Route>

        {/* CUSTODIAN ONLY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['custodian']} />}>
          <Route path="/custodian/dashboard" element={<CustodianDashboardPage />} />
          <Route path="/custodian/scan-qr" element={<ScanQRPage />} />
          <Route path="/custodian/buddy-system" element={<BuddySystemPage />} />
          <Route path="/custodian/task-operations" element={<TaskMain />} />
        </Route>



      {/* fallback redirects to login if not found or authenticated */}
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </BrowserRouter>
  
  );
}

export default App
 