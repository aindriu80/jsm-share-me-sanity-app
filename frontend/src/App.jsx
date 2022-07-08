// import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// import logo from './logo.svg'
// import './App.css'
import Login from './components/Login'
import Home from './container/Home'
// const clientId = import.meta.env.VITE_GOOGLE_API_TOKEN

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  )
}

export default App
