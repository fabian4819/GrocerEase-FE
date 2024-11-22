import { HiShoppingCart } from 'react-icons/hi'
import Link from 'next/link'

const Navbar = () => {
    return (
        <nav className="w-full font-[Dosis]">
            <div className="h-[61px] relative bg-[#1d1d21]">
                <div className="flex items-center gap-2 absolute left-[90px] top-[13px]">
                    <HiShoppingCart size={40} color="white" />
                    <span className="text-white text-2xl ml-7 font-medium">Dashboard</span>
                </div>
                <Link href="/login" className="absolute right-[40px] top-[15px] text-white text-2xl mr-6 font-medium hover:text-gray-300">
                    Keluar
                </Link>
            </div>
        </nav>
    )
}

export default Navbar