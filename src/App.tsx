// imports
import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingPage } from './components/Loading'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

// auth 
import { LoginPage } from './pages/auth/Login'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { NewAccountPasswordSetupPage } from './pages/auth/AccountPasswordSetupPage'

// shared/public pages
import UnauthorizedPage from './pages/UnauthorizedPage'
import NotFoundPage from './pages/NotFoundPage'
import { ScannerPage } from './pages/ScannerPage'
import { AssetScanPage } from './pages/AssetScanPage'
import { ProfilePage } from './pages/admin/Profile/ProfileMain'
import { PublicReportingPage } from './pages/PublicReportingPage'

// admin pages
import { DashboardPage } from './pages/admin/Dashboard/DashboardPage'
import { AssetRegistryPage } from './pages/admin/AssetPage/AssetRegistryPage'
import { TaskMonitorPage } from './pages/admin/TaskMonitor/TaskMonitorPage'
import { TaskManagementPage } from './pages/admin/TaskManager/TaskManagementPage'
import { LostAndFoundPage } from './pages/admin/LostandFound/LostAndFound'
import { IncidentReportPage } from './pages/admin/IncidentReport/IncidentReporting'
import { LogsPage } from './pages/admin/LogsModule/LogsMain'
import { ManageAccountsPage } from './pages/admin/ManageAccounts/ManageAccountPage'
import { ArchivesPage } from './pages/admin/ArchivesModule/ArchivesMain'

// custodian pages
import CustodianDashboardPage from './pages/custodian/Dashboard/DashboardPage'
import ScanQRPage from './pages/custodian/ScanQR/ScanQRPage'
import BuddySystemPage from './pages/custodian/BuddySystem/BuddySystemPage'
import TaskMain from './pages/custodian/TaskOperation/TaskOperationPage'
import ZoneTaskPage from './pages/custodian/TaskOperation/AreaTaskPage'

// redirect user who logged in
function DashboardRedirect() {
  const { isLoggedIn, role } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  } else if (role === 'custodian') {
    return <Navigate to="/custodian/dashboard" replace />;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, role } = useAuth();
  
  if (isLoggedIn) {
    if (role === 'admin') return <Navigate to="/dashboard" replace />;
    if (role === 'custodian') return <Navigate to="/custodian/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

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
        <Route path='/' element={<DashboardRedirect />} />
        <Route path='/login' element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        } />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />
        <Route path='/not-found' element={<NotFoundPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/qr-scanner' element={<ScannerPage />} />
        <Route path='/asset/scan/:assetId' element={<AssetScanPage />} />
        <Route path='/setup/new-password' element={<NewAccountPasswordSetupPage />} />
        <Route path='/report-an-issue' element={<PublicReportingPage />} />

        {/* SHARED PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'custodian']} />}>
          <Route path="/asset-registry" element={<AssetRegistryPage />} />
          <Route path="/lost-and-found" element={<LostAndFoundPage />} />
          <Route path="/incident-report" element={<IncidentReportPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/scan-qr" element={<ScanQRPage />} />
        </Route>

        {/* ADMIN ONLY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/task-monitor" element={<TaskMonitorPage />} />
          <Route path="/manage-task" element={<TaskManagementPage />} />
          <Route path="/audit-logs" element={<LogsPage />} />
          <Route path="/manage-accounts" element={<ManageAccountsPage />} />
          <Route path="/archives" element={<ArchivesPage />} />
        </Route>

        {/* CUSTODIAN ONLY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['custodian']} />}>
          <Route path="/custodian/dashboard" element={<CustodianDashboardPage />} />
          <Route path="/custodian/buddy-system" element={<BuddySystemPage />} />
          <Route path="/custodian/task-operations" element={<TaskMain />} />
          <Route path="/custodian/zone-tasks" element={<ZoneTaskPage />} />
        </Route>

      {/* fallback redirects to login if not found or authenticated */}
      <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  
  );
}

export default App
 