"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaSortUp, FaSortDown, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaStore } from "react-icons/fa";
import Link from "next/link";
import Navbar from "../components/navbar";
import DefaultButton from "../components/defaultButton";
import PaginationButton from "../components/paginationButton";
import { api } from '@/utils/api';

type Store = {
  _id: string;
  store_name: string;
  image_link: string;
  location: string;
  latitude: number;
  longitude: number;
  contact_info: string;
  opening_hours: string;
  description: string;
};

type User = {
  address: string;
  latitude: number;
  longitude: number;
};

const user: User = {
  address: "User Address",
  latitude: -7.770717,
  longitude: 110.3695,
};

const StoreList = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [sortBy, setSortBy] = useState<string>("nosort");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storesPerPage = 10;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const data = await api.stores.getAll();
        setStores(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores
    .filter((store) =>
      store.store_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.store_name.localeCompare(b.store_name);
      } else if (sortBy === "location") {
        const distanceA = haversineDistance(
          user.latitude,
          user.longitude,
          a.latitude,
          a.longitude
        );
        const distanceB = haversineDistance(
          user.latitude,
          user.longitude,
          b.latitude,
          b.longitude
        );
        comparison = distanceA - distanceB;
      }

      return isAscending ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredStores.length / storesPerPage);
  const startIndex = (currentPage - 1) * storesPerPage;
  const currentStores = filteredStores.slice(
    startIndex,
    startIndex + storesPerPage
  );

  function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6378137;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function formatDistance(distance: number) {
    return distance < 1000
      ? `${Math.round(distance)} m`
      : `${(distance / 1000).toFixed(2)} km`;
  }

  const getPagination = () => {
    const pages: (string | number)[] = [];
    if (currentPage > 2) pages.push(1, "...");
    if (currentPage > 1) pages.push(currentPage - 1);
    pages.push(currentPage);
    if (currentPage < totalPages) pages.push(currentPage + 1);
    if (currentPage < totalPages - 1) pages.push("...", totalPages);
    return pages;
  };

  const handlePageChange = (page: number | string) => {
    if (typeof page === "number" && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-['Dosis']">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Temukan Toko Terdekat
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Jelajahi berbagai toko di sekitar Anda dan temukan yang Anda butuhkan
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-red-700 underline hover:text-red-800 ml-2"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="ml-4 text-gray-600">Memuat data toko...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-12">
            <FaStore className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">Belum ada toko yang terdaftar</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="relative w-full md:w-[300px]">
                <input
                  type="text"
                  placeholder="Cari Toko"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-black bg-white shadow-sm border border-gray-200 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-600">Urutkan:</span>
                <select
                  className="bg-white border text-black border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="nosort">Standar</option>
                  <option value="name">Nama</option>
                  <option value="location">Jarak</option>
                </select>
                <button 
                  onClick={() => setIsAscending(!isAscending)}
                  className="p-2 hover:bg-gray-100 rounded-full transition duration-200"
                >
                  {isAscending ? (
                    <FaSortUp className="text-gray-600 text-xl" />
                  ) : (
                    <FaSortDown className="text-gray-600 text-xl" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {currentStores.map((store) => {
                const distance = haversineDistance(
                  user.latitude,
                  user.longitude,
                  store.latitude,
                  store.longitude
                );

                return (
                  <div
                    key={store._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-48 relative">
                        <Image
                          src={store.image_link || "/img/background.jpg"}
                          alt={store.store_name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                        />
                      </div>
                      <div className="flex-grow p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                              {store.store_name}
                            </h2>
                            <p className="text-blue-600 font-medium mb-4">
                              {formatDistance(distance)} dari lokasi Anda
                            </p>
                          </div>
                          <Link href={`/storeDetail/${store._id}`}>
                            <DefaultButton onClick={() => {}}>
                              Lihat Detail
                            </DefaultButton>
                          </Link>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="text-gray-400 mr-2" />
                            <span>{store.location}</span>
                          </div>
                          <div className="flex items-center">
                            <FaPhoneAlt className="text-gray-400 mr-2" />
                            <span>{store.contact_info}</span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="text-gray-400 mr-2" />
                            <span>{store.opening_hours}</span>
                          </div>
                        </div>
                        
                        <p className="mt-4 text-gray-600 line-clamp-2">
                          {store.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-8 gap-2">
              <PaginationButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </PaginationButton>
              
              {getPagination().map((page, index) =>
                typeof page === "number" ? (
                  <PaginationButton
                    key={index}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationButton>
                ) : (
                  <span
                    key={index}
                    className="px-4 py-2 text-gray-400"
                  >
                    {page}
                  </span>
                )
              )}
              
              <PaginationButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </PaginationButton>
            </div>

            <div className="flex justify-center gap-4 mt-12">
              <Link href="/store/create">
                <DefaultButton onClick={() => {}}>
                  Tambah Toko Anda
                </DefaultButton>
              </Link>
              <Link href="/store/my-stores">
                <DefaultButton onClick={() => {}}>
                  Lihat Toko Anda
                </DefaultButton>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoreList;