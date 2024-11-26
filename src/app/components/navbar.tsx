import { HiShoppingCart } from 'react-icons/hi';
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`w-full font-['Dosis'] fixed top-0 z-50 transition-all duration-300 ${
            scrolled ? 'shadow-lg' : ''
        }`}>
            <div className={`h-[70px] relative bg-[#1d1d21] transition-all duration-300 ${
                scrolled ? 'bg-opacity-95 backdrop-blur-sm' : ''
            }`}>
                {/* Logo and Brand */}
                <div className="flex items-center gap-2 absolute left-[90px] top-1/2 transform -translate-y-1/2">
                    <div className="relative group cursor-pointer">
                        <HiShoppingCart 
                            size={40} 
                            className="text-white transition-transform duration-300 group-hover:scale-110" 
                        />
                        <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
                    </div>
                    <span className="text-white text-2xl ml-7 font-medium tracking-wide hover:text-gray-200 transition-colors duration-300">
                        Dashboard
                    </span>
                </div>

                {/* Navigation Links */}
                <div className="absolute right-[40px] top-1/2 transform -translate-y-1/2 flex items-center space-x-6">
                    <Link 
                        href="/editProfile" 
                        className="flex items-center text-white text-lg font-medium transition-all duration-300 hover:text-blue-400 group"
                    >
                        <FaUserEdit className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                        <span>Edit Profile</span>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
                    </Link>

                    <div className="h-6 w-px bg-gray-600" /> {/* Divider */}

                    <Link 
                        href="/login" 
                        className="flex items-center text-white text-lg font-medium transition-all duration-300 hover:text-red-400 group"
                    >
                        <FaSignOutAlt className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                        <span>Keluar</span>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full" />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className="space-y-2">
                        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${
                            isMenuOpen ? 'rotate-45 translate-y-2.5' : ''
                        }`} />
                        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${
                            isMenuOpen ? 'opacity-0' : ''
                        }`} />
                        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${
                            isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                        }`} />
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden absolute w-full bg-[#1d1d21] transition-all duration-300 ${
                isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}>
                <div className="p-4 space-y-4">
                    <Link 
                        href="/editProfile" 
                        className="flex items-center text-white text-lg font-medium hover:text-blue-400 transition-colors duration-300"
                    >
                        <FaUserEdit className="mr-2" />
                        <span>Edit Profile</span>
                    </Link>
                    <Link 
                        href="/login" 
                        className="flex items-center text-white text-lg font-medium hover:text-red-400 transition-colors duration-300"
                    >
                        <FaSignOutAlt className="mr-2" />
                        <span>Keluar</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;