import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
const Ctx = createContext(null);
export function AuthProvider({children}){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ const t=localStorage.getItem('token'); if(!t){setLoading(false);return;}
    api.get('/auth/me').then(r=>setUser(r.data.user)).catch(()=>{localStorage.removeItem('token');}).finally(()=>setLoading(false));
  },[]);
  const login = async (email,password)=>{ const r=await api.post('/auth/login',{email,password}); localStorage.setItem('token',r.data.token); setUser(r.data.user); return r.data.user; };
  const signup = async (name,email,password,role)=>{ const r=await api.post('/auth/signup',{name,email,password,role}); localStorage.setItem('token',r.data.token); setUser(r.data.user); return r.data.user; };
  const logout = ()=>{ localStorage.removeItem('token'); setUser(null); };
  return <Ctx.Provider value={{user,loading,login,signup,logout}}>{children}</Ctx.Provider>;
}
export const useAuth = ()=> useContext(Ctx);