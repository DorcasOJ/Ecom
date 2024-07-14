import "./App.css";
import Register from './pages/Register';
import Login from './pages/Login';
import {
  Routes,
  Route
} from "react-router-dom";
import React from 'react'
import Welcome from "./pages/Welcome";
import { GoogleOAuthProvider } from '@react-oauth/google';
import EmailVerifcation from "./pages/EmailVerification";

const App = () => {
  const GoogleClientId = `${import.meta.env.VITE_API_GOOGLE_CLIENT_ID}`;
  return (
   
    <GoogleOAuthProvider clientId={GoogleClientId}>

      <Routes>
        
      <Route path="/" element={<Welcome Login={false} />} />
      <Route path="/login" element={<Welcome Login={true} />} />
      <Route path="/email-verification" element={<EmailVerifcation />} />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App

{/*   <Route path="/" element={<Register />} />*/}
    // <Route path="/login" element={<Login />} />