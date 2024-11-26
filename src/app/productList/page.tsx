"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortUp, FaSortDown, FaStore } from "react-icons/fa";
import Link from "next/link";
import Navbar from "@/app/components/navbar";
import PaginationButton from "@/app/components/paginationButton";
import DefaultButton from "@/app/components/defaultButton";

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

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_link: string;
  store_id: string;
};

type JoinedProduct = {
  store: Store;
  product: Product;
};

type User = {
  latitude: number;
  longitude: number;
};

const user: User = {
  latitude: -7.770717,
  longitude: 110.3695,
};

const API_URL = process.env.NEXT_PUBLIC_API_AUTH;

function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "location" | null>(
    null
  );
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 20;

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all products
        const response = await fetch(`${API_URL}products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Error loading products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStores = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all products
        const response = await fetch(`${API_URL}stores`);
        if (!response.ok) {
          throw new Error("Failed to fetch stores");
        }

        const data = await response.json();
        setStores(data);
      } catch (err) {
        setError("Error loading stores. Please try again later.");
        console.error("Error fetching stores:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    fetchStores();
  }, []);

  const product_store: JoinedProduct[] = products
    .map((product) => {
      const store = stores.find((store) => store._id === product.store_id);
      if (store) {
        return { store, product };
      }
      return null;
    })
    .filter((entry): entry is JoinedProduct => entry !== null);

  // Calculate distance helper function
  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
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
  };

  const formatDistance = (distance: number) => {
    return distance < 1000
      ? `${Math.round(distance)} m`
      : `${(distance / 1000).toFixed(2)} km`;
  };

  // Filter and sort products
  const filteredProducts = product_store
    .filter((product) =>
      product.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0;

      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.product.name.localeCompare(b.product.name);
          break;
        case "price":
          comparison = a.product.price - b.product.price;
          break;
        case "location":
          if (a.store && b.store) {
            const distanceA = haversineDistance(
              user.latitude,
              user.longitude,
              a.store.latitude,
              a.store.longitude
            );
            const distanceB = haversineDistance(
              user.latitude,
              user.longitude,
              b.store.latitude,
              b.store.longitude
            );
            comparison = distanceA - distanceB;
          }
          break;
      }
      return isAscending ? comparison : -comparison;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
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

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white font-['Dosis'] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-white font-['Dosis'] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-['Dosis']">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/storeList">
              <DefaultButton onClick={() => {}}>
                Kembali ke Daashboard
              </DefaultButton>
            </Link>
          </div>

          {/* Title and Search Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
              Daftar Produk
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Cari Produk"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white text-black shadow-sm border border-gray-200 rounded-full py-3 px-6 pr-12 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-600">Urutkan:</span>
                <select
                  className="bg-white text-black border border-gray-200 rounded-lg px-4 py-2 
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy || ""}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "name" | "price" | "location" | null
                    )
                  }
                >
                  <option value="">Standar</option>
                  <option value="name">Nama</option>
                  <option value="price">Harga</option>
                  <option value="location">Jarak Toko</option>
                </select>
                <button
                  onClick={() => setIsAscending(!isAscending)}
                  className="p-2 hover:bg-gray-100 rounded-full transition duration-200 text-black"
                >
                  {isAscending ? (
                    <FaSortUp className="text-xl" />
                  ) : (
                    <FaSortDown className="text-xl" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {currentProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <FaStore className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => {
                let distance = "-";
                if (product.store) {
                  distance = formatDistance(
                    haversineDistance(
                      user.latitude,
                      user.longitude,
                      product.store.latitude,
                      product.store.longitude
                    )
                  );
                } else {
                  distance = "-";
                }
                return (
                  <div
                    key={product.product._id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-48">
                      <Image
                        src={
                          product.product.image_link || "/img/background.jpg"
                        }
                        alt={product.product.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-black group-hover:text-blue-500 transition-colors duration-300">
                        {product.product.name}
                      </h3>
                      <p className="text-lg font-bold text-blue-600 mb-2">
                        Rp {product.product.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        {distance} dari lokasi Anda
                      </p>
                      {product.store && (
                        <Link href={`/storeDetail/${product.store._id}`}>
                          <p className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300">
                            {product.store.store_name}
                          </p>
                        </Link>
                      )}
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {product.product.description}
                      </p>
                    </div>
                  </div>
                );
              })}
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
                  >
                    {page}
                  </PaginationButton>
                ) : (
                  <span key={index} className="px-4 py-2 text-gray-400">
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

export default ProductListPage;
