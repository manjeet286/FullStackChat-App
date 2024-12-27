import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/useAuthstore";
import { Loader } from "lucide-react";
import { useThemeStore } from "./store/useThemeStore";
function App() {
  const { authUser, checkAuth  ,isCheckingAuth , onlineUsers} = useAuthStore();
   const {theme}=useThemeStore();
   console.log(onlineUsers)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if(isCheckingAuth && !authUser)
  {
      return (<div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>)
  }

  return (
    <div data-theme={theme}>
      <NavBar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>} />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/"/>} />
        <Route path="/login" element={!authUser ?<LoginPage />: <Navigate to="/"/>} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage />: <Navigate to="/login"/>} />
      </Routes>
    </div>
  );
}

export default App;
