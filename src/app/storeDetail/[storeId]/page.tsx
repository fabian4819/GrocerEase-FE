"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaSortUp, FaSortDown, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaArrowLeft, FaStore } from "react-icons/fa";
import Navbar from "@/app/components/navbar";
import PaginationButton from "@/app/components/paginationButton";
import DefaultButton from "@/app/components/defaultButton";

type Store = {
  store_id: string;
  store_name: string;
  image_link: string;
  location: string;
  latitude: number;
  longitude: number;
  contact_info: string;
  opening_hours: string;
  description: string;
};

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image_link?: string;
  shop_id: string;
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

const API_URL = process.env.NEXT_PUBLIC_API_AUTH;

function StoreDetailPage() {
  const params = useParams();
  const storeId = params.storeId;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | null>(null);
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 20;

  // Fetch store and products data
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);

        // Fetch store details
        const storeResponse = await fetch(`${API_URL}stores/${storeId}`);
        if (!storeResponse.ok) {
          throw new Error('Failed to fetch store details');
        }
        const storeData = await storeResponse.json();
        setStore(storeData);

        // Fetch store's products
        const productsResponse = await fetch(`${API_URL}products/store/${storeId}`);
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);

        setError(null);
      } catch (err) {
        setError('Error loading store data. Please try again later.');
        console.error('Error fetching store data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white font-['Dosis'] flex items-center justify-center text-black">
        <div className="text-2xl">Loading store details...</div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="w-full min-h-screen bg-white font-['Dosis'] flex items-center justify-center">
        <div className="text-2xl text-red-500">
          {error || 'Store not found'}
        </div>
      </div>
    );
  }

  // Filter and sort products
  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      const comparison =
        sortBy === "name" ? a.name.localeCompare(b.name) : a.price - b.price;
      return isAscending ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex + productsPerPage
  );

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

  // Calculate distance
  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6378137; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (distance: number) => {
    if (distance < 1000) return `${Math.round(distance)} m`;
    return `${(distance / 1000).toFixed(2)} km`;
  };

  const distance = haversineDistance(
    user.latitude,
    user.longitude,
    store.latitude,
    store.longitude
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-['Dosis']">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/storeList">
              <div className="inline-flex items-center gap-2 hover:-translate-x-1 transition-all duration-300">
                <DefaultButton onClick={() => { }}>
                  <span className="flex items-center gap-2">
                    <FaArrowLeft />
                    Kembali ke Daftar Toko
                  </span>
                </DefaultButton>
              </div>
            </Link>
          </div>

          {/* Store Information */}
          <div className="bg-white rounded-xl shadow-lg mb-12 overflow-hidden">
            <div className="relative h-[300px] w-full">
              <Image
                src={store.image_link || "/img/background.jpg"}
                alt={store.store_name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-4xl font-bold mb-2">{store.store_name}</h2>
                <div className="flex items-center gap-2 text-white/90">
                  <FaMapMarkerAlt />
                  <span>{formatDistance(distance)} dari lokasi Anda</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaPhoneAlt className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Kontak</p>
                    <p className="font-semibold text-black">{store.contact_info}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaClock className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Jam Operasional</p>
                    <p className="font-semibold text-black">{store.opening_hours}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="font-semibold text-black">{store.location}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">{store.description}</p>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-black">
              <FaStore className="text-blue-500" />
              Produk Tersedia
            </h3>

            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Cari Produk"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-black"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex items-center gap-4 text-black">
                <span>Urutkan:</span>
                <select
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  value={sortBy || ""}
                  onChange={(e) => setSortBy(e.target.value as "name" | "price" | null)}
                >
                  <option value="">Standar</option>
                  <option value="name">Nama</option>
                  <option value="price">Harga</option>
                </select>
                <button
                  onClick={() => setIsAscending(!isAscending)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                >
                  {isAscending ? <FaSortUp className="text-xl" /> : <FaSortDown className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FaStore className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-48">
                      <Image
                        src={product.image_link || "/img/background.jpg"}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-black group-hover:text-blue-500 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-blue-600 mb-2">
                        Rp {product.price.toLocaleString()}
                      </p>
                      {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreDetailPage;