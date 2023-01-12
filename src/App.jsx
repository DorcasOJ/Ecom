import "./App.css";
import Register from './pages/Register';
import Login from './pages/Login';
import {
  Routes,
  Route
} from "react-router-dom";


import React from 'react'

const App = () => {
 
  return (
    <Routes>
    <Route path="/" element={<Register />} />
    <Route path="/login" element={<Login />} />
  </Routes>
  )
}

export default App