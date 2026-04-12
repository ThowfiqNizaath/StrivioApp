import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import api from "../../Files/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginRightImg from "../assets/loginRightImg.jpg";
import {useSnackbar} from "notistack"

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { errorHandlerFn } = useAuth();
  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {
    doubleCheckPassword();
  }, [confirmPassword]);

  // useEffect(() => {
  //     console.log(name)
  //     console.log(email)
  //     console.log(password)
  //     console.log(confirmPassword)
  // }, [name, email, password, confirmPassword])

  function doubleCheckPassword() {
    if (confirmPassword === password && confirmPassword) {
      passwordRef.current.style.borderColor = "Green";
    } else {
      if (confirmPassword !== password && confirmPassword) {
        passwordRef.current.style.borderColor = "Red";
      }
    }
  }

  async function signup(e) {
    e.preventDefault();
    try {
      if (confirmPassword === password) {
        await api.post("/register/signup/", {
          username: name,
          email: email,
          password: confirmPassword,
        });
        enqueueSnackbar("Account created successfully", {variant: 'success'})
        navigate("/login");
      } else {
        passwordRef.current.style.borderColor = "Red";
        passwordRef.current.focus();
      }
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  return (
    <div className="w-full h-screen grid place-items-center">
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-[90vw]  sm:w-[60vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] shadow-lg rounded">
        {/* Signup Form */}
        <div className="p-4">
          <div className="font-bold text-2xl">Strivio</div>
          <form
            className="flex flex-col my-10 w-[90%] mx-auto"
            onSubmit={signup}
          >
            <h3 className="font-semibold text-gray-600 mt-4 mb-6  text-xl ">
              Create an account
            </h3>

            <div className="flex flex-col gap-0.5">
              <label
                htmlFor="signupUsername"
                className="text-sm font-semibold text-gray-500"
              >
                Username:
              </label>
              <input
                type="text"
                id="signupUsername"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-1 py-0.5 rounded border-gray-300 focus:outline-0 focus:border-gray-600 cursor-pointer"
                required
              />
            </div>

            <div className="flex flex-col gap-0.5 mt-1">
              <label
                htmlFor="signupEmail"
                className="text-sm font-semibold text-gray-500"
              >
                Email:
              </label>
              <input
                type="email"
                id="signupEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-1 py-0.5 rounded border-gray-300 focus:outline-0 focus:border-gray-600 cursor-pointer"
                required
              />
            </div>

            <div className="flex flex-col gap-0.5 mt-1">
              <label
                htmlFor="signupPassword"
                className="text-sm font-semibold text-gray-500"
              >
                Password:
              </label>
              <input
                type="password"
                id="signupPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-1 py-0.5 rounded border-gray-300 focus:outline-0 focus:border-gray-600 cursor-pointer"
                required
              />
            </div>
            <div className="flex flex-col gap-0.5 mt-1">
              <label
                htmlFor="signupCpassword"
                className="text-sm font-semibold text-gray-500"
              >
                Confirm Password:
              </label>
              <input
                type="text"
                id="signupCpassword"
                value={confirmPassword}
                ref={passwordRef}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border px-1 py-0.5 rounded border-gray-300 focus:outline-0 focus:border-gray-600 cursor-pointer"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-gray-600 text-white w-full py-2 mt-10 rounded font-semibold cursor-pointer"
            >
              SignUp
            </button>

            <div className="mt-5 flex gap-2 justify-center flex-wrap">
              <p className="text-sm md:text-base text-gray-600">
                Do you have account?
              </p>
              <Link
                to="/login"
                className="text-sm md:text-base font-medium underline text-gray-800"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>

        {/* Image */}
        <div className="hidden md:block">
          <img
            src={loginRightImg}
            className="w-full h-full object-center object-cover"
          />
        </div>
      </div>
    </div>

    // </div>

    // <form onSubmit={signup}>
    //   <h1>Sign Page</h1>
    //   <label>
    //     Username:
    //     <input
    //       type="text"
    //       value={name}
    //       onChange={(e) => setName(e.target.value)}
    //       className="border"
    //       required
    //     />
    //   </label>

    //   <label>
    //     Email:
    //     <input
    //       type="email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       className="border"
    //       required
    //     />
    //   </label>

    //   <label>
    //     Password:
    //     <input
    //       type="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       className="border"
    //       required
    //     />
    //   </label>

    //   <label>
    // Confirm Password:
    //     <input
    //       type="text"
    //       value={confirmPassword}
    //       ref = {passwordRef}
    //       onChange={(e) => setConfirmPassword(e.target.value)}
    //       className="border"
    //       required
    //     />
    //   </label>

    //   <button type="submit">SignUp</button>
    // </form>
  );
};

export default SignUp;
