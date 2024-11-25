'use client';
import React from "react";
import Link from 'next/link';
import LoginButton from '../components/loginButton'

const Login = () => {
  return(  
  <div className="w-full h-screen bg-cover bg-center bg-[url('/img/background.jpg')]">
    <div className="absolute inset-0 bg-black opacity-20"></div>
    <div className="flex items-center justify-center min-h-screen">
      {/* Login Card */}
      <div className="relative w-[90%] max-w-[426px] bg-neutral-100 p-6 rounded-lg shadow-lg">
        {/* Header */}
        <h1 className="text-center mb-6 text-[#22577a] text-[49.77px] font-semibold font-['Dosis']">Masuk ke Dashboard</h1>
        {/* Form */}
        <form>
          {/* Email Input */}
          <div className="w-[80%] mx-auto mb-6">
            <input
              type="email"
              placeholder="email@mail.com"
              className="w-full h-12 bg-neutral-100 border-b border-[#393a41] pl-[14px] text-[#747680] text-2xl font-light font-['Dosis'] focus:outline-none"
            />
          </div>
          {/* Password Input */}
          <div className="w-[80%] mx-auto mb-6">
            <input
              type="password"
              placeholder="password"
              className="w-full h-12 bg-neutral-100 border-b border-[#393a41] pl-[14px] text-[#747680] text-2xl font-light font-['Dosis'] focus:outline-none"
            />
          </div>
          {/* Submit Button */}
          <div className="w-[80%] mx-auto">
            <Link href="/dashboard">
              <LoginButton/>
            </Link>
          </div>
        </form>
      </div>
    </div>
    </div>
    )
}

export default Login;