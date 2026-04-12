import React from 'react'
import { NavLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center -mt-15">
      <div className="flex gap-2">
        <div className="text-4xl md:text-6xl font-medium ">4</div>
        <div className="text-4xl md:text-6xl font-medium">0</div>
        <div className="text-4xl md:text-6xl font-medium">4</div>
      </div>
      <div className="w-[80%] mt-2 text-sm md:text-base mx-auto text-center">
        This page is in <span className="text-blue-600"> progress </span> or unavailable. Please return to
        the{" "}
        <NavLink
          to="/protected/dashboard"
          className="text-blue-600 font-semibold cursor-pointer underline text-base md:text-lg"
        >
          dashboard page
        </NavLink>
        .
      </div>
    </div>
  );
}

export default NotFound