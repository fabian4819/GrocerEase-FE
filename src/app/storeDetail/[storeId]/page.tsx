"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaSortUp, FaSortDown } from "react-icons/fa";
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
      <div className="w-full min-h-screen bg-white font-['Dosis'] flex items-center justify-center">
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
    <div className="w-full min-h-screen bg-white font-['Dosis']">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/storeList">
            <DefaultButton onClick={() => { }}>
              Kembali ke Daftar Toko
            </DefaultButton>
          </Link>
        </div>

        {/* Store Header */}
        <h1 className="text-center mb-8 text-black font-bold text-4xl">
          Detail Toko
        </h1>

        {/* Store Information */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-full max-w-2xl">
            <Image
              src={store.image_link || "/img/background.jpg"}
              alt={store.store_name}
              width={400}
              height={400}
              className="rounded-lg mx-auto mb-6"
            />
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-black">
                {store.store_name}
              </h2>
              <p className="text-lg">
                Jarak: {formatDistance(distance)}
              </p>
              <p className="text-gray-700">{store.description}</p>
              <p className="font-semibold">Contact: {store.contact_info}</p>
              <p>Opening Hours: {store.opening_hours}</p>
              <p>Location: {store.location}</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-gray-50 rounded-lg shadow-md p-6">
          {/* Search and Sort Controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Cari Produk"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 rounded-full py-2 px-4 pr-10"
              />
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center gap-4">
              <span>Urutkan berdasarkan:</span>
              <select
                className="bg-white border rounded px-3 py-1"
                value={sortBy || ""}
                onChange={(e) => setSortBy(e.target.value as "name" | "price" | null)}
              >
                <option value="">Jangan urutkan</option>
                <option value="name">Nama</option>
                <option value="price">Harga</option>
              </select>
              <button
                onClick={() => setIsAscending(!isAscending)}
                className="text-xl"
              >
                {isAscending ? <FaSortUp /> : <FaSortDown />}
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {currentProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Tidak ada produk yang ditemukan
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col"
                >
                  <Image
                    src={product.image_link || "/img/background.jpg"}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="rounded-md mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-lg font-bold mb-2">
                    Rp {product.price.toLocaleString()}
                  </p>
                  {product.description && (
                    <p className="text-sm text-gray-600 flex-grow">
                      {product.description}
                    </p>
                  )}
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
  );
}

export default StoreDetailPage;