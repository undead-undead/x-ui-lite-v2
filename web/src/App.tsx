import { Sidebar } from './components/Sidebar';
import { Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './views/LoginPage';
import { Dialog } from './components/Dialog';
import { Toaster } from 'react-hot-toast';

const AddInboundModal = lazy(() => import('./components/AddInboundModal').then(module => ({ default: module.AddInboundModal })));
const BackupModal = lazy(() => import('./components/BackupModal').then(module => ({ default: module.BackupModal })));
const LogsModal = lazy(() => import('./components/LogsModal').then(m => ({ default: m.LogsModal })));
const QRCodeModal = lazy(() => import('./components/QRCodeModal').then(m => ({ default: m.QRCodeModal })));

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-center" />
      {!isAuthenticated ? (
        <LoginPage key="auth-login" />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>

          <Suspense fallback={null}>
            <AddInboundModal />
            <BackupModal />
            <LogsModal />
            <QRCodeModal />
          </Suspense>
        </div>
      )}

      <Dialog />
    </div>
  );
}

export default App;