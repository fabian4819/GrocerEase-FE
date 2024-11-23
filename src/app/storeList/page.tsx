"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaSearch, FaSortUp, FaSortDown } from "react-icons/fa";
import Navbar from "../components/navbar";
import DefaultButton from "../components/defaultButton";

type Store = {
  store_id: number;
  store_name: string;
  image_link: string;
  location: string;
  contact_info: string;
  opening_hours: string;
  description: string;
};

const dummyStores: Store[] = Array.from({ length: 100 }, (_, i) => ({
  store_id: i + 1,
  store_name: `Toko ${i + 1}`,
  image_link: `/img/background.jpg`, // Alternating image links for simplicity
  location: `Lokasi ${i + 1}`,
  contact_info: `+62 812 345 67${i}`,
  opening_hours: "9 AM - 9 PM",
  description: `Contoh deskripsi untuk toko ke-${
    i + 1
  }. Cuma untuk placeholder yak.`,
}));

const StoreList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  //TODO: Fitur Search untuk mencari nama toko
  const [searchTerm, setSearchTerm] = useState("");
  const [isAscending, setIsAscending] = useState(true); // Menyimpan status urutan
  const [sortBy, setSortBy] = useState<string>("name");

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
        comparison = a.location.localeCompare(b.location);
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

  // Handle page change
  const handlePageChange = (page: number | string) => {
    if (typeof page === "number" && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortOrderToggle = () => {
    setIsAscending(!isAscending);
  };

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
              <option value="name">Nama</option>
              <option value="location">Lokasi</option>
              <option value="nosort">Jangan Urutkan</option>
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
        {currentStores.map((store) => (
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
                {store.store_name}
              </h2>
              <p>
                <strong>Location:</strong> {store.location}
              </p>
              <p>
                <strong>Contact Info:</strong> {store.contact_info}
              </p>
              <p>
                <strong>Opening Hours:</strong> {store.opening_hours}
              </p>
              <p>{store.description}</p>
            </div>
            <div>
              <DefaultButton>Lihat Detail</DefaultButton>
            </div>
          </div>
        ))}

        {/* Handle nomor page di bawah */}
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
              padding: "10px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
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
                  padding: "10px",
                  backgroundColor: currentPage === page ? "#007BFF" : "#f0f0f0",
                  color: currentPage === page ? "#fff" : "#000",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ) : (
              <span
                key={index}
                style={{
                  margin: "0 5px",
                  padding: "10px",
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
              padding: "10px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
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
          <DefaultButton>Tambah Toko Anda</DefaultButton>
          <DefaultButton>Lihat Toko Anda</DefaultButton>
        </div>
      </div>
    </div>
  );
};

export default StoreList;
