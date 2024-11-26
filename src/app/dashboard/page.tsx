'use client';
import { AiFillShop } from 'react-icons/ai'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar'
import { motion } from 'framer-motion'

const Dashboard = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 font-[Dosis]">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-gray-800 mb-16"
        >
          Selamat Datang di Dashboard GrocerEase
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-50 rounded-full">
                <AiFillShop size={100} className="text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Kelola Toko</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Kamu manajer toko sembako yang membawahi banyak toko sekaligus?
              Kelola tokomu di sini! Mulai dari tambahkan cabang toko hingga listing barang-barang yang dijual.
            </p>
            <button onClick={() => router.push('/storeList')} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-8 rounded-lg transition-colors duration-300 transform hover:scale-105">
              Kelola Toko
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-50 rounded-full">
                <HiOutlineShoppingBag size={100} className="text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Item</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Kamu orang hemat yang lagi berburu harga sembako murah?
              Kelola belanjaanmu di sini! Bisa bandingin harga dari berbagai toko yang tersedia.
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 px-8 rounded-lg transition-colors duration-300 transform hover:scale-105">
              Daftar Item
            </button>
          </motion.div>
        </div>

        {/* <div className="text-center w-[236px]">
        <div className="flex justify-center">
          <HiOutlineShoppingBag size={150} color="black" />
          </div>
          <button className="bg-[#1e1e1e] text-white text-xl font-bold font-dosis px-[30px] py-[15px] mt-[58px]">
            Belanja Cerdas
          </button>
          <p className="text-black text-xl font-bold font-dosis mt-10">
            Kamu orang hemat yang lagi berburu harga sembako murah? Kelola belanjaanmu di sini! Bisa bandingin harga dari berbagai toko yang tersedia
          </p>
        </div>

        <div className="text-center w-[236px]">
        <div className="flex justify-center">
          <HiTrendingUp size={150} color="black" />
          </div>
          <button className="bg-[#1e1e1e] text-white text-xl font-bold font-dosis px-[30px] py-[15px] mt-[58px]">
            Lihat Analitik
          </button>
          <p className="text-black text-xl font-bold font-dosis mt-10">
            Penasaran gimana tren harga sembako ke depannya? Lihat perkembangan harga sembako dari berbagai toko yang tersedia
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default Dashboard