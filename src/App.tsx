import './App.css'
import DashboardPage from './pages/Dashboard/Dashboard'
import { LoginPage } from './pages/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/login" replace />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
 