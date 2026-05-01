import './App.css'
import SidebarProfile from './components/SidebarProfile'
import ProfileInfoCard from './Module/Profile/ProfileMain';
import Logs from './pages/Logs/LogsMain';

function App() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <SidebarProfile />
      <main className="pl-[240px]">
        <ProfileInfoCard />
      </main>
    </div>
  )
}

export default App
