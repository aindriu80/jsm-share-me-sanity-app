import React, { useState, useRef, useEffect } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Route, Routes } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Login from '../components/Login'
import UserProfile from '../components/UserProfile'

import Pins from './Pins'
import { userQuery } from '../utils/data'

import { client } from '../client'
import logo from '../assets/logo.png'

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState(null)

  const userInfo =
    localStorage.getItem('user') !== 'undefined'
      ? JSON.parse(localStorage.getItem('user'))
      : localStorage.clear()

  useEffect(() => {
    const query = userQuery(userInfo?.googleId)

    client.fetch(query).then((data) => {
      setUser(data[0])
    })
  }, [])

  return (
    <div className="flex flex-col h-screen duration-75 ease-out bg-gray-50 md:flex-row transaction-height">
      <div className="flex-initial hidden h-screen md:flex">
        <Sidebar user={user && user} />
      </div>
      <div className="flex flex-row md:hidden">
        <HiMenu
          fontSize={40}
          className="cursor-pointer"
          onClick={() => setToggleSidebar(true)}
        />
        <Link to="/">
          <img src={logo} alt="logo" className="w-28" />
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          <img src={user?.image} alt="logo" className="w-28" />
        </Link>
      </div>
      {toggleSidebar && (
        <div className="fixed z-10 w-4/5 h-screen overflow-y-auto bg-white shadow-md animate-slide-in">
          <div className="absolute flex items-center w-full p-2 justifiy-end">
            <AiFillCloseCircle
              fontSize={30}
              className="cursor-pointer"
              onClick={() => setToggleSidebar(false)}
            />
          </div>
          <Sidebar user={user && user} closeToggle={setToggleSidebar} />
        </div>
      )}
    </div>
  )
}

export default Home
