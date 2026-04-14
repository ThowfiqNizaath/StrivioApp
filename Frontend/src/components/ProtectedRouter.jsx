import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Asidebar } from "./Asidebar";
import { X } from "lucide-react";
import { Menu } from "lucide-react";

export const ProtectedRouter = () => {
  const { user, authUser, showMenu, setShowMenu, loading} = useAuth();

  // if (!user && !loading) {
  //   return <Navigate to="/login" />;
  // }

  // if(loading){
  //   return <div>loading...</div>
  // }

  return (
    <div className="flex h-screen relative">
      <div
        className={`${showMenu ? "  max-md:left-0 max-sm:w-[80%] sm:w-[50%]" : "max-md:-left-100"} max-md:absolute md:w-54 lg:w-64 bg-gray-800 text-white px-2  transform transition-all duration-500 max-md:top-0 max-md:bottom-0 max-md:z-200`}
      >
        <Asidebar />
      </div>

      <div className="md:hidden absolute top-5 right-5 z-200 p-2 rounded-full bg-white backdrop:blur-2xl cursor-pointer">
        <button onClick={() => setShowMenu((prev) => !prev)}>
          {showMenu ? (
            <X className="w-8 h-8 cursor-pointer" />
          ) : (
            <Menu className="w-6 h-6 md:w-8 md:h-8 cursor-pointer" />
          )}
        </button>
      </div>

      <div className="flex-1 p-4 pt-20 overflow-x-hidden h-full relative">
        {loading ? (
          <div className="h-full flex justify-center items-center">
            <div className="w-10 h-10 border-6 border-gray-600 border-b-white animate-spin rounded-full"></div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};
