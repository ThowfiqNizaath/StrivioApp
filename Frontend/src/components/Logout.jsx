import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { LoaderCircle } from 'lucide-react'

export const Logout = () => {
    const {logout} = useAuth()
    const [logoutLoading, setLogoutLoading] = useState(false)

    async function handelLogout(){
      setLogoutLoading(true)
      await logout()
      setLogoutLoading(false)
    }
  return (
    // <button onClick={logout} className="border w-full p-2 rounded-sm bg-red-500 text-md font-semibold active:bg-red-700 cursor-pointer">
    //     {
    //       logoutLoading ?  : "Logout"
    //     }
    // </button>
    <button
      type="submit"
      className="border w-full p-2 rounded-sm bg-red-500 text-md font-semibold active:bg-red-700 text-white cursor-pointer flex justify-center items-center"
      disabled={logoutLoading}
      onClick={handelLogout}
    >
      {logoutLoading ? (
        <LoaderCircle className="animate-spin duration-300 ease-in" />
      ) : (
        "Logout"
      )}
    </button>
  );
}
