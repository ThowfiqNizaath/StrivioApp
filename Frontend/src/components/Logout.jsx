import React from 'react'
import { useAuth } from '../context/AuthContext'

export const Logout = () => {
    const {logout} = useAuth()
  return (
    <button onClick={logout} className="border w-full p-2 rounded-sm bg-red-500 text-md font-semibold active:bg-red-700 cursor-pointer">
        Logout
    </button>
  )
}
