import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ScannerPage from './pages/ScannerPage';
import FirewallPage from './pages/FirewallPage';
import NetworkScanPage from './pages/NetworkScanPage';
import AgentManagementPage from './pages/AgentManagementPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="scanner" element={<ScannerPage />} />
          <Route path="firewall" element={<FirewallPage />} />
          <Route path="network" element={<NetworkScanPage />} />
          <Route path="agents" element={<AgentManagementPage />} />
          {/* Add other authenticated routes here as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
