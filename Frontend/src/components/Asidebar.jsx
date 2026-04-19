import React, { useState, useEffect } from 'react'
import { Logout } from './Logout'
import { asideNav } from '../../Files/asserts'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Asidebar = () => {
  const {setShowMenu} = useAuth()
  const [showInstall, setShowInstall] = useState(false)
  // const [deferredPrompt, setDeferredPrompt] = useState(null);


  // useEffect(() => {
  //   const img = new Image();
  //   img.src = "/loginRightImg-512.png";
  //   img.onload = () => console.log(img.width, img.height);
  // }, [])

  // useEffect(() => console.log(deferredPrompt), [deferredPrompt])

  // useEffect(() => {
  //   const handler = (e) => {
  //     e.preventDefault();
  //     console.log(e)

  //     const isInstalled =
  //       window.matchMedia("(display-mode: standalone)").matches ||
  //       window.navigator.standalone === true;

  //     if (!isInstalled) {
  //       setDeferredPrompt(e);
  //     }
  //   };

  //   window.addEventListener("beforeinstallprompt", handler);

  //   return () => window.removeEventListener("beforeinstallprompt", handler);
  // }, []);


  // useEffect(() => {
  //   const installedHandler = () => {
  //     setDeferredPrompt(null);
  //     setShowInstall(false);
  //   };

  //   window.addEventListener("appinstalled", installedHandler);

  //   return () => window.removeEventListener("appinstalled", installedHandler);
  // }, []);


  // const installApp = async () => {
  //   if (!deferredPrompt) {
  //     alert("Install not available yet");
  //     return;
  //   }

  //   deferredPrompt.prompt();

  //   const choice = await deferredPrompt.userChoice;

  //   if (choice.outcome === "accepted") {
  //     console.log("User installed ✅");
  //   } else {
  //     console.log("User dismissed ❌");
  //   }

  //   setDeferredPrompt(null);
  //   setShowInstall(false);
  // };
  

  // function handleInstall(){
  //   setShowInstall(prev => !prev)
  // }

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
        {/* {deferredPrompt && ( */}
          {/* <button
            className="border border-gray-600 text-left p-2 px-4 cursor-pointer"
            onClick={handleInstall}
          >
            Get App
          </button> */}
        {/* )} */}
      </div>

      <div className="mb-10">
        <Logout />
      </div>

      {showInstall && (
        <div className="bg-black/50 fixed inset-0 z-200 flex justify-center items-center text-black">
          <div className="bg-white p-4 rounded m-4">
            <p className="font-medium text-md sm:text-xl">
              Keep your routine just one tap away
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="px-2 py-0.5 bg-gray-500 text-white rounded  hover:scale-105 cursor-pointer transform transition-all duration-300"
                onClick={() => setShowInstall(false)}
              >
                Cancel
              </button>
              <button
                className="px-2 py-0.5 bg-[#14B8A6] text-white rounded hover:scale-105 cursor-pointer transform transition-all duration-300"
                onClick={installApp}
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
