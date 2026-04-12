import React from 'react'
import { Logout } from './Logout'
import { asideNav } from '../../Files/asserts'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Asidebar = () => {
  const {setShowMenu} = useAuth()
  return (
    <div className="relative h-full flex flex-col justify-between transition duration-75">
      <div className="flex flex-col gap-5 py-10">
        {asideNav.map((nav, index) => (
          <NavLink
            key={index}
            to={nav.url}
            className={(e) =>
              `p-2 px-4 ${e.isActive ? "bg-white text-black rounded-sm" : ""}`
            }
            onClick={() => setShowMenu(false)}
          >
            {nav.name}
          </NavLink>
        ))}
      </div>

      <div className="mb-10">
        <Logout />
      </div>
    </div>
  );
}
