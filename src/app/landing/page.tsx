'use client'
import React from 'react'
import LoginButton from '../components/loginButton'
import RegisterButton from '../components/registerButton'
import { HiShoppingCart } from 'react-icons/hi'
import Link from 'next/link'

const Landing = () => {
  return (
  <div className="w-full h-screen bg-cover bg-center bg-[url('/img/background.jpg')]">
    <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="top-[155px] left-[630px] absolute">
        <HiShoppingCart size={150} color="white"/>
      </div>
      <div className="left-[429px] top-[356px] absolute text-white text-[49.77px] font-semibold font-['Dosis']">Selamat datang di GrocerEase!</div>
      <div className="w-[888px] h-36 left-[300px] top-[483px] absolute text-center text-white text-[32px] font-semibold font-['Dosis']">Kami menyediakan layanan analitik harga sembako bagi manajer toko sembako dan pembeli bijak, kayak kamu 🫵</div>
      <div className="w-[146px] h-[51px] left-[647px] top-[678px] absolute text-center text-white text-[32px] font-semibold font-['Dosis']">atau</div>
      <div className="left-[440px] top-[678px] absolute">
        <Link href="/login">
          <LoginButton/>
        </Link>
      </div>
      <div className="left-[794px] top-[678px] absolute">
        <Link href="/register">
        <RegisterButton/>
        </Link>
      </div>
  </div>
  )
}

export default Landing