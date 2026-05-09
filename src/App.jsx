import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import GuestLanding from './components/GuestLanding';
import { isGuestMode } from './lib/guestProgress';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import Lab from './pages/Lab';
import MascotStudio from './pages/MascotStudio';
import KnowledgeBase from './pages/KnowledgeBase';
import BattleLogs from './pages/BattleLogs';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [guestActive, setGuestActive] = useState(isGuestMode());

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (guestActive) {
    return (
      <Routes>
        <Route element={<Layout isGuest />}>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/mascot" element={<MascotStudio />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/battle-logs" element={<BattleLogs />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    );
  }

  if (authError) {
    if (authError.type === 'auth_required') {
      return <GuestLanding onGuestStart={() => setGuestActive(true)} />;
    }
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/mascot" element={<MascotStudio />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/battle-logs" element={<BattleLogs />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App