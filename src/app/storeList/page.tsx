"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaSortUp, FaSortDown } from "react-icons/fa";
import Link from "next/link";
import Navbar from "../components/navbar";
import DefaultButton from "../components/defaultButton";

//Change store_id type if it's not number
type Store = {
  store_id: number;
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
  latitude: -7.770717, // UGM, Yogyakarta
  longitude: 110.3695,
};

const StoreList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  //Dummy Stores
  const [dummyStores, setDummyStores] = useState<Store[]>([]);

  useEffect(() => {
    const getPseudoRandomOffset = (seed: number) => {
      return ((Math.sin(seed) + 1) / 2) * 0.01 - 0.005; // Scale to (-0.005, 0.005)
    };

    const generateDummyStores = () => {
      const stores = Array.from({ length: 100 }, (_, i) => ({
        store_id: i + 1,
        store_name: `Toko ${i + 1}`,
        image_link: `/img/background.jpg`,
        location: `Lokasi ${i + 1}`,
        latitude: -7.780717 + getPseudoRandomOffset(i + 1),
        longitude: 110.387724 + getPseudoRandomOffset(100 + i + 1),
        contact_info: `+62 812 345 67${i}`,
        opening_hours: "9 AM - 9 PM",
        description: `Contoh deskripsi untuk toko ke-${
          i + 1
        }. Cuma untuk placeholder yak.`,
      }));
      setDummyStores(stores);
    };

    generateDummyStores();
  }, []);

  //TODO: Fitur Search untuk mencari nama toko
  const [searchTerm, setSearchTerm] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [sortBy, setSortBy] = useState<string>("nosort");

  const storesPerPage = 10;

  // TODO: Fitur Sort mungkin by name atau by Jarak. //
  const filteredStores = dummyStores
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

      // If isAscending is false, reverse the order
      return isAscending ? comparison : -comparison;
    });

  // Algoritma untuk atur page
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);
  const startIndex = (currentPage - 1) * storesPerPage;
  const currentStores = filteredStores.slice(
    startIndex,
    startIndex + storesPerPage
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

  function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6378137; // Earth's radius in meters

    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters

    return distance;
  }

  function formatDistance(distance: number) {
    if (distance < 1000) {
      return `${Math.round(distance)} m`; // Display in meters if less than 1 km
    } else {
      return `${(distance / 1000).toFixed(2)} km`; // Display in kilometers
    }
  }

  // Handle page change
  const handlePageChange = (page: number | string) => {
    if (typeof page === "number" && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortOrderToggle = () => {
    setIsAscending(!isAscending);
  };

  const doNothing = () => {};

  return (
    <div className="w-full min-h-screen bg-white font-['Dosis']">
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
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
          Daftar Toko
        </h1>

        {/* TODO : Search and Filter */}
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
              placeholder="Cari Toko"
              value={searchTerm}
              className="w-[415px] border-2 text-[#1c1c1c] border-[#1c1c1c] rounded-full py-2 px-4 "
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                paddingRight: "30px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              <FaSearch style={{ color: "black" }} />
            </span>
          </div>

          {/* Filter Dropdown */}
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nosort">Jangan Urutkan</option>
              <option value="name">Nama</option>
              <option value="location">Lokasi</option>
            </select>
            <button onClick={handleSortOrderToggle}>
              {isAscending ? (
                <FaSortUp className="text-[#1d1d21] text-xl" />
              ) : (
                <FaSortDown className="text-[#1d1d21] text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* List Store */}
        {currentStores.map((store) => {
          const distance = haversineDistance(
            user.latitude,
            user.longitude,
            store.latitude,
            store.longitude
          );

          return (
            <div
              key={store.store_id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
                display: "flex",
              }}
            >
              <div>
                <Image
                  src={store.image_link}
                  alt={store.store_name}
                  width={150}
                  height={150}
                  style={{
                    borderRadius: "8px",
                    marginTop: "15px",
                    marginRight: "20px",
                  }}
                />
              </div>
              <div
                className={"font-['Dosis']"}
                style={{ flex: 1, color: "black" }}
              >
                <h2
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {store.store_name} ({formatDistance(distance)} dari lokasi
                  Anda)
                </h2>
                <p>
                  <strong>Lokasi:</strong> {store.location}
                </p>
                <p>
                  <strong>Info Kontak:</strong> {store.contact_info}
                </p>
                <p>
                  <strong>Jam Buka:</strong> {store.opening_hours}
                </p>
                <p>{store.description}</p>
              </div>
              <div>
                <Link href={`/storeDetail/${store.store_id}`}>
                  <DefaultButton onClick={doNothing}>
                    View Details
                  </DefaultButton>
                </Link>
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0",
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              margin: "0 5px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              color: "#000",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ccc"; // Dimmed black
              e.currentTarget.style.color = "#000"; // Keep text black
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff"; // Default white
              e.currentTarget.style.color = "#000"; // Default black text
            }}
          >
            &lt;
          </button>
          {getPagination().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                style={{
                  margin: "0 5px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: currentPage === page ? "#000" : "#fff",
                  color: currentPage === page ? "#fff" : "#000",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  transition: "background-color 0.2s, color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = "#ccc"; // Dimmed black
                    e.currentTarget.style.color = "#000"; // Keep text black
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = "#fff"; // Default white
                    e.currentTarget.style.color = "#000"; // Default black text
                  }
                }}
              >
                {page}
              </button>
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
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              margin: "0 5px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ccc"; // Dimmed black
              e.currentTarget.style.color = "#000"; // Keep text black
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff"; // Default white
              e.currentTarget.style.color = "#000"; // Default black text
            }}
          >
            &gt;
          </button>
        </div>

        {/* Tombol button di bawah */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <DefaultButton onClick={doNothing}>Tambah Toko Anda</DefaultButton>
          <DefaultButton onClick={doNothing}>Lihat Toko Anda</DefaultButton>
        </div>
      </div>
    </div>
  );
};

export default StoreList;
