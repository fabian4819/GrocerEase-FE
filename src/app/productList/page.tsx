﻿"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortUp, FaSortDown } from "react-icons/fa";
import Navbar from "@/app/components/navbar";
import PaginationButton from "@/app/components/paginationButton";
import DefaultButton from "@/app/components/defaultButton";

// Store and Product Types
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
  product_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  store_id: string;
};

type JoinedProduct = {
  store: Store;
  product: Product;
};

type User = {
  address: string;
  latitude: number;
  longitude: number;
};

// Dummy user data
const user: User = {
  address: "User Address",
  latitude: -7.770717, // UGM, Yogyakarta
  longitude: 110.3695,
};

function ProductListPage() {
  // State for dummy data
  const [dummyStores, setDummyStores] = useState<Store[]>([]);
  const [dummyProducts, setDummyProducts] = useState<Product[]>([]);

  const [joinedProducts, setJoinedProducts] = useState<JoinedProduct[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | null>(null);
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 20;

  // Dummy data generation
  useEffect(() => {
    const getPseudoRandomOffset = (seed: number) => {
      return ((Math.sin(seed) + 1) / 2) * 0.01 - 0.005; // Scale to (-0.005, 0.005)
    };

    const generateDummyStores = () => {
      return Array.from({ length: 100 }, (_, i) => ({
        store_id: `${i + 1}`,
        store_name: `Toko ${i + 1}`,
        image_link: `/img/background.jpg`,
        location: `Lokasi ${i + 1}`,
        latitude: -7.770717 + getPseudoRandomOffset(i + 1),
        longitude: 110.3695 + getPseudoRandomOffset(100 + i + 1),
        contact_info: `+62 812 345 67${i}`,
        opening_hours: "9 AM - 9 PM",
        description: `Contoh deskripsi untuk toko ke-${
          i + 1
        }. Cuma untuk placeholder yak.`,
      }));
    };

    const generateDummyProducts = () => {
      const getPseudoRandomValue = (seed: number, range: number) => {
        return ((Math.sin(seed) + 1) / 2) * range; // Scale to range (0, range)
      };

      return Array.from({ length: 200 }, (_, i) => ({
        product_id: `P${i + 1}`,
        name: `Product ${i + 1}`,
        description: `Description for product ${
          i + 1
        }. Lorem Ipsum sir dolor met amet`,
        price: Math.round(getPseudoRandomValue(i + 1, 100000)), // Price between 0 and 100000
        image_url: `/img/background.jpg`, // Placeholder images
        store_id: `${(i % 100) + 1}`, // Ensure valid store_id
      }));
    };

    const stores = generateDummyStores();
    const products = generateDummyProducts();

    // Join stores and products
    const product_store: JoinedProduct[] = products
      .map((product) => {
        const store = stores.find(
          (store) => store.store_id === product.store_id
        );
        if (store) {
          return { store, product };
        }
        return null;
      })
      .filter((entry): entry is JoinedProduct => entry !== null);

    // Update state
    setDummyStores(stores);
    setDummyProducts(products);
    setJoinedProducts(product_store);
  }, []);

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
    return R * c; // in meters
  };

  const formatDistance = (distance: number) => {
    if (distance < 1000) return `${Math.round(distance)} m`;
    return `${(distance / 1000).toFixed(2)} km`;
  };

  // Filter, sort, and paginate products
  const filteredProducts = joinedProducts
    .filter((product) =>
      product.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.product.name.localeCompare(b.product.name);
      } else if (sortBy === "price") {
        comparison = a.product.price - b.product.price;
      } else if (sortBy === "location") {
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
      return isAscending ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Pagination helper
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

  const doNothing = () => {
    console.log(filteredProducts);
    console.log(dummyProducts);
    console.log(dummyStores);
    console.log(joinedProducts);
  };

  return (
    <div className="w-full min-h-screen bg-white font-['Dosis']">
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
        {/* Go to Store List Button */}
        <div style={{ marginBottom: "20px" }}>
          <DefaultButton onClick={doNothing}>
            Kembali ke Daftar Toko
          </DefaultButton>
        </div>

        {/* Title */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "black",
            fontWeight: "bold",
            fontSize: "36px",
          }}
        >
          Detail Toko
        </h1>
        <div className="mb-6 p-4 border rounded-lg shadow-md bg-gray-50 text-center">
          {/* Search and Sort */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            {/* Search Bar */}
            <div
              className="flex items-center mb-4"
              style={{ position: "relative", width: "250px" }}
            >
              <input
                type="text"
                placeholder="Cari Produk"
                value={searchTerm}
                className="w-[415px] border-2 font-['Dosis'] text-[#1c1c1c] border-[#1c1c1c] rounded-full py-2 px-4 "
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  paddingRight: "40px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              />
              <span className="absolute right-4 top-2/4 -translate-y-2/4 text-gray-500">
                <FaSearch />
              </span>
            </div>

            {/* Sort Dropdown */}
            <div
              className="font-['Dosis']"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "black",
              }}
            >
              <span>Urutkan berdasarkan:</span>
              <select
                className="bg-white border border-gray-300 rounded px-2 py-1 font-['Dosis']"
                value={sortBy || ""}
                onChange={(e) => setSortBy(e.target.value as "name" | "price")}
              >
                <option value="">Jangan urutkan</option>
                <option value="name">Nama</option>
                <option value="price">Harga</option>
                <option value="location">Jarak Toko</option>
              </select>
              <button onClick={() => setIsAscending(!isAscending)}>
                {isAscending ? (
                  <FaSortUp className="text-xl" />
                ) : (
                  <FaSortDown className="text-xl" />
                )}
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {currentProducts.length === 0 ? (
            <div className="text-center text-gray-500 font-semibold font-['Dosis']">
              Tidak ada produk yang ditemukan
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {currentProducts.map((product) => {
                const distance = haversineDistance(
                  user.latitude,
                  user.longitude,
                  product.store.latitude,
                  product.store.longitude
                );
                return (
                  <div
                    key={product.product.product_id}
                    className="border rounded-lg shadow-md p-4 flex flex-col items-center"
                  >
                    <Image
                      src={product.product.image_url || "img/background.jpg"}
                      alt={product.product.name}
                      width={250}
                      height={250}
                      className="rounded-md"
                    />

                    <h2
                      className="text-black font-semibold font-['Dosis']"
                      style={{ fontSize: 20 }}
                    >
                      {product.product.name}
                    </h2>
                    <p className="text-black mb-2">
                      Rp {product.product.price.toLocaleString()}
                    </p>
                    <div className="w-full font-['Dosis'] text-left text-black text-sm font-black">
                      {product.store.store_name}  ({formatDistance(distance)})
                    </div>
            
                    <div className="w-full text-left">
                      <p className="text-sm text-black">
                        {product.product.description}
                      </p>
                    </div>

                
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ccc"; // Dimmed black
                e.currentTarget.style.color = "#000"; // Keep text black
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff"; // White
                e.currentTarget.style.color = "#000"; // Keep text black
              }}
            >
              &lt;
            </PaginationButton>
            {getPagination().map((page, index) =>
              typeof page === "number" ? (
                <PaginationButton
                  key={index}
                  onClick={() => handlePageChange(page)}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = "#ccc"; // Dimmed black
                      e.currentTarget.style.color = "#000"; // Keep text black
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = "#fff"; // White
                      e.currentTarget.style.color = "#000"; // Keep text black
                    }
                  }}
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
                  style={{
                    margin: "0 5px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                  }}
                >
                  {page}
                </span>
              )
            )}
            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ccc"; // Dimmed black
                e.currentTarget.style.color = "#000"; // Keep text black
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff"; // White
                e.currentTarget.style.color = "#000"; // Keep text black
              }}
              disabled={currentPage === totalPages}
            >
              &gt;
            </PaginationButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListPage;