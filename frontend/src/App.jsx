import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ConnectEmail from './pages/ConnectEmail';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import ThreadDetail from './pages/ThreadDetail';
import ClientView from './pages/ClientView';
import Accounts from './pages/Accounts';
import Chat from './pages/Chat';
import AITools from './pages/AITools';
import Compose from './pages/Compose';
import Templates from './pages/Templates';
import Reminders from './pages/Reminders';
import Layout from './components/Layout';

function Protected({children, role}){ const {user,loading}=useAuth(); if(loading) return <div className="p-8">Loading...</div>; if(!user) return <Navigate to="/login"/>; if(role && user.role!==role) return <Navigate to={user.role==='client'?'/client':'/dashboard'}/>; return children; }

export default function App(){
  const {user}=useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/connect" element={<Protected><ConnectEmail/></Protected>}/>
      <Route path="/dashboard" element={<Protected role="assistant"><Layout><Dashboard/></Layout></Protected>}/>
      <Route path="/inbox" element={<Protected role="assistant"><Layout><Inbox/></Layout></Protected>}/>
      <Route path="/thread/:id" element={<Protected role="assistant"><Layout><ThreadDetail/></Layout></Protected>}/>
      <Route path="/accounts" element={<Protected role="assistant"><Layout><Accounts/></Layout></Protected>}/>
      <Route path="/chat" element={<Protected role="assistant"><Layout><Chat/></Layout></Protected>}/>
<Route path="/ai-tools" element={<Protected role="assistant"><Layout><AITools/></Layout></Protected>}/>
<Route path="/compose" element={<Protected role="assistant"><Layout><Compose/></Layout></Protected>}/>
<Route path="/templates" element={<Protected role="assistant"><Layout><Templates/></Layout></Protected>}/>
<Route path="/reminders" element={<Protected role="assistant"><Layout><Reminders/></Layout></Protected>}/>
      <Route path="/client" element={<Protected role="client"><ClientView/></Protected>}/>
      <Route path="*" element={<Navigate to={user? (user.role==='client'?'/client':'/dashboard') : '/'}/>}/>
    </Routes>
  );
}


