import React, { use } from 'react'
import './App.css'
import Navbar from './components/Navbar.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react';
import {Loader, Sidebar} from "lucide-react"
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore.js'



const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  console.log(onlineUsers);
  const {theme} = useThemeStore();
  useEffect(() => {
    checkAuth();
   
  }, [checkAuth]);

  // console.log("Auth User:", authUser);

  if (isCheckingAuth && !authUser) 
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    ) ;
  
    return (
      <div data-theme={theme} >
        <Navbar />
        <div className="pt-16"> {/* 👈 Add padding equal to navbar height */}
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} /> 
            <Route path="/settings" element={<SettingsPage /> } /> 
          </Routes>
        </div>
        <Toaster /> 
      </div>
    )
  };

export default App