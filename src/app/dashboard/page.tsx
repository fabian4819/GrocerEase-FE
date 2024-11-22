import { AiFillShop } from 'react-icons/ai'
import { HiOutlineShoppingBag, HiTrendingUp } from 'react-icons/hi'
// import Link from 'next/link'
import Navbar from '../components/navbar'

const Dashboard = () => {
  return (
    <div className="w-full h-screen relative bg-white font-[Dosis]">
      <Navbar />
      <div className="flex justify-between px-[20%] mt-40">
        <div className="text-center w-[236px]">
          <div className="flex justify-center">
            <AiFillShop size={150} color="black" />
          </div>
          <button className="bg-[#1e1e1e] text-white text-xl font-bold font-dosis px-[30px] py-[15px] mt-[58px]">
            Kelola Toko
          </button>
          <p className="text-black text-xl font-bold font-dosis mt-10">
            Kamu manajer toko sembako yang membawahi banyak toko sekaligus?<br />
            Kelola tokomu di sini! Mulai dari tambahkan cabang toko hingga listing barang-barang yang dijual
          </p>
        </div>

        <div className="text-center w-[236px]">
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
        </div>
      </div>
    </div>
  )
}

export default Dashboard