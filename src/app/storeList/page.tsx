"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaSortUp, FaSortDown } from "react-icons/fa";
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
  // const API_URL = process.env.NEXT_PUBLIC_API_AUTH || 'http://localhost:5000/';

  // Fetch stores from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const data = await api.stores.getAll()
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
    <div className="w-full min-h-screen bg-white font-['Dosis']">
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
        <h1 className="text-center mb-8 text-black font-bold text-4xl">
          Daftar Toko
        </h1>

        {error ? (
          <div className="text-center p-4 mb-4 bg-red-100 text-red-700 rounded">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-4 underline"
            >
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className="text-center p-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading stores...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center p-4">
            No stores found
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div className="relative w-[250px]">
                <input
                  type="text"
                  placeholder="Cari Toko"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-2 font-['Dosis'] text-[#1c1c1c] border-[#1c1c1c] rounded-full py-2 px-4"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <FaSearch style={{ color: "black" }} />
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span>Urutkan berdasarkan:</span>
                <select
                  className="bg-white border border-gray-300 rounded px-2 py-1"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="nosort">Jangan Urutkan</option>
                  <option value="name">Nama</option>
                  <option value="location">Lokasi</option>
                </select>
                <button onClick={() => setIsAscending(!isAscending)}>
                  {isAscending ? (
                    <FaSortUp className="text-[#1d1d21] text-xl" />
                  ) : (
                    <FaSortDown className="text-[#1d1d21] text-xl" />
                  )}
                </button>
              </div>
            </div>

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
                  className="border rounded-lg p-6 mb-6 flex items-start"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={store.image_link || "/img/background.jpg"}
                      alt={store.store_name}
                      width={150}
                      height={150}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-grow px-6">
                    <h2 className="text-xl font-bold mb-2">
                      {store.store_name} ({formatDistance(distance)} dari lokasi Anda)
                    </h2>
                    <p><strong>Lokasi:</strong> {store.location}</p>
                    <p><strong>Info Kontak:</strong> {store.contact_info}</p>
                    <p><strong>Jam Buka:</strong> {store.opening_hours}</p>
                    <p>{store.description}</p>
                  </div>
                  <div>
                    <Link href={`/storeDetail/${store._id}`}>
                      <DefaultButton onClick={() => {}}>
                        View Details
                      </DefaultButton>
                    </Link>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-center mt-8">
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
                    customStyle={{
                      backgroundColor: currentPage === page ? "#000" : "#fff",
                      color: currentPage === page ? "#fff" : "#000",
                    }}
                  >
                    {page}
                  </PaginationButton>
                ) : (
                  <span
                    key={index}
                    className="mx-2 w-10 h-10 rounded-full flex items-center justify-center text-gray-500"
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
          </>
        )}

        <div className="flex justify-center gap-4 mt-8">
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
      </div>
    </div>
  );
};

export default StoreList;