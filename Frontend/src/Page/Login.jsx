import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import loginRightImg from "../assets/loginRightImg.jpg";
import { LoaderCircle } from "lucide-react";

function Login() {
  const {login } = useAuth();
  const [username_or_email, setUsername_or_email] = useState(localStorage.getItem("username_or_email") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("username_or_email") ? true : false
  );
  const [loginLoading, setLoginLoading] = useState(false)
  


  useEffect(() => {
    handleRemeberMe()
  }, [rememberMe])

  async function handleFormSubmit(e) {
    e.preventDefault();
    setLoginLoading(true)
    await login(username_or_email, password);
    setUsername_or_email("");
    setPassword("");
    setLoginLoading(false)
  }

  function handleRemeberMe(){
    if(rememberMe && username_or_email){
       localStorage.setItem('username_or_email', username_or_email)
    }else{
      localStorage.removeItem('username_or_email')
    }
  }

  return (
    <div className="w-full h-screen grid place-items-center">
      {/* content */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-[90vw]  sm:w-[60vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] shadow-lg rounded">
        {/* Login Form */}
        <div className="p-4">
          <div className="font-bold text-2xl">Strivio</div>
          <form onSubmit={handleFormSubmit} className="my-10 w-[90%] mx-auto">
            <h3 className="font-semibold text-gray-800 mt-4 mb-6  text-xl">
              Login to an account
            </h3>
            <div className="flex flex-col gap-0.5">
              <label
                htmlFor="loginUsername"
                className="text-sm font-semibold text-gray-500"
              >
                Username_or_Email:
              </label>
              <input
                id="loginUsername"
                className="border px-1 py-0.5 rounded border-gray-300 focus:outline-0 focus:border-gray-600 cursor-pointer"
                type="text"
                value={username_or_email}
                onChange={(e) => setUsername_or_email(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-0.5 mt-1">
              <label
                htmlFor="loginPassword"
                className="text-sm font-semibold text-gray-500"
              >
                Password:
              </label>
              <input
                id="loginPassword"
                className="border px-1 py-0.5 rounded focus:outline-0 focus:border-gray-600 border-gray-300 cursor-pointer"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-1 mt-4 justify-end">
              <input
                type="checkbox"
                className="w-4 h-4 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <p className="text-sm md:text-base font-semibold text-gray-800">
                Remember me
              </p>
            </div>

            <button
              type="submit"
              className="bg-gray-600 text-white w-full py-2 mt-10 rounded font-semibold cursor-pointer flex justify-center items-center"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <LoaderCircle className="animate-spin duration-300 ease-in" />
              ) : (
                "Login"
              )}
            </button>

            <div className="mt-5 flex gap-2 justify-center flex-wrap">
              <p className="text-sm md:text-base text-gray-600">
                Don't you have account?
              </p>
              <Link
                to="/signup"
                className="text-sm md:text-base font-medium underline text-gray-800"
              >
                Register here
              </Link>
            </div>
          </form>
        </div>

        {/* Image Side */}
        <div className="hidden md:block">
          <img
            src={loginRightImg}
            className="w-full h-full object-center object-cover"
          />
        </div>
      </div>
    </div>

    // <div className="flex items-center w-[80%] mx-auto h-screen">
    //   {/* Left */}
    //   <div className="h-[80%] w-1/2 flex flex-col border">
    //     <div className="text-2xl font-medium m-4">Strivio</div>
    //     <div className="flex items-center flex-1 max-w-[80%] mx-auto w-full">
    //       <form onSubmit={handleFormSubmit} className="flex flex-col w-full">
    //         <h3 className="text-xl font-medium my-4">Login Page</h3>
    //         <div className="flex flex-col gap-0.5 w-full">
    //           <label
    //             htmlFor="loginUsername"
    //             className="text-sm md:text-base font-medium"
    //           >
    //             Username_or_Email:
    //           </label>
    //           <input
    //             id="loginUsername"
    //             className="text-base md:text-lg placeholder:text-sm border p-1 rounded"
    //             type="text"
    //             placeholder="Enter your username or email"
    //             value={username_or_email}
    //             onChange={(e) => setUsername_or_email(e.target.value)}
    //             required
    //           />
    //         </div>
    //         <div className="flex flex-col gap-0.5 mt-2">
    //           <label
    //             htmlFor="loginPassword"
    //             className="text-sm md:text-base font-medium"
    //           >
    //             Password:
    //           </label>
    //           <input
    //             id="loginPassword"
    //             type="password"
    //             className="text-base md:text-lg placeholder:text-sm border rounded p-1"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             required
    //           />
    //         </div>

    //         <div className="flex items-center gap-1 mt-4 justify-end">
    //           <input type="checkbox" className="w-4 h-4" />
    //           <p className="text-sm md:text-base font-medium">Remember me</p>
    //         </div>

    //         <button
    //           type="submit"
    //           className="border mt-10 p-2 rounded bg-gray-800 text-white cursor-pointer"
    //         >
    //           Login
    //         </button>

    //         <div className="mt-5 flex gap-2">
    //           <p className="text-sm md:text-base">Don't you have account?</p>
    //           <Link
    //             to="/signup"
    //             className="text-sm md:text-base font-medium underline"
    //           >
    //             Register here
    //           </Link>
    //         </div>
    //       </form>
    //     </div>
    //   </div>

    //   {/* Right */}
    //   <div className="w-1/2 h-full border">
    //     <div className="h-[80%] flex items-center border">
    //       {/* <img
    //         src={loginRightImg}
    //         className="w-full h-full object-center object-cover"
    //       /> */}
    //     </div>
    //   </div>
    // </div>
  );
}

export default Login;
