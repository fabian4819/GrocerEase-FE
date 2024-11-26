"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../components/navbar";
import DefaultButton from "../components/defaultButton";
import FileUploadButton from "../components/fileUploadButton";

const AddStore = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: "",
    storeName: "",
    image_link: "",
    address: "",
    latitude: 0.0,
    longitude: 0.0,
    contact: "",
    openingHours: "",
    description: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<{
    storeName: string;
    address: string;
    imageUrl: string;
  }>({
    storeName: "",
    address: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isReadyToUpload, setIsReadyToUpload] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setFormData((prevData) => ({
        ...prevData,
        userId: user.id || "",
      }));
    }
  }, []);

  const handleImageChange = (file: File) => {
    setImage(file);
    const imagePreviewUrl = URL.createObjectURL(file);
    setImageUrl(imagePreviewUrl);
    setImageName(file.name);
    setErrorMessages((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessages((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = async (): Promise<string | ""> => {
    if (!image) {
      return "";
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "grocerEase");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);
        return data.secure_url;
      } else {
        alert("Upload failed");
        return "";
      }
    } catch (error) {
      alert(`Error uploading image. Error: ${error}`);
      return "";
    }
  };

  const handleSubmit = async () => {
    let valid = true;
    const newErrorMessages = { storeName: "", address: "", imageUrl: "" };

    if (!imageUrl) {
      newErrorMessages.imageUrl = "Tolong Masukkan Gambar Toko Anda";
      valid = false;
    }
    if (!formData.storeName) {
      newErrorMessages.storeName = "Tolong Masukkan Nama Toko";
      valid = false;
    }
    if (!formData.address) {
      newErrorMessages.address = "Tolong Masukkan Alamat Toko";
      valid = false;
    }

    setErrorMessages(newErrorMessages);

    if (!valid) return;

    const uploadedImageUrl = await handleImageUpload();
    if (!uploadedImageUrl) return;
    else {
      setFormData((prev) => ({ ...prev, image_link: uploadedImageUrl }));
    }
  };

  const continueUploading = async () => {
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const LatLong = await getLatLong(formData.address);
      if (LatLong) {
        const { lat, lng } = LatLong;
        formData.latitude = lat as number;
        formData.longitude = lng as number;
        console.log(
          JSON.stringify({
            user_id: formData.userId,
            store_name: formData.storeName,
            image_link: formData.image_link,
            location: formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
            contact_info: formData.contact,
            opening_hours: formData.openingHours,
            description: formData.description,
          })
        );
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_AUTH}stores/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: formData.userId,
            store_name: formData.storeName,
            image_link: formData.image_link,
            location: formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
            contact_info: formData.contact,
            opening_hours: formData.openingHours,
            description: formData.description,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Store Registration failed");
      }

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.name === "AbortError" ? "Request timeout" : err.message);
      } else {
        alert("Store Registration failed");
      }
      setIsReadyToUpload(false);
    } finally {
      setIsLoading(false);
    }
    console.log("Data: ", formData);
  };

  useEffect(() => {
    if (formData.image_link && !isReadyToUpload && formData.userId) {
      console.log("Ready to upload");
      setIsReadyToUpload(true);
      continueUploading();
    }
  }, [formData.image_link, formData.userId]);

  async function getLatLong(address: string) {
    const apiKey = process.env.NEXT_PUBLIC_HERE_API_KEY;
    try {
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
          address
        )}&in=countryCode:IDN&limit=1&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const { lat, lng } = data.items[0].position;
        console.log("LatLong: ", { lat, lng });
        return { lat, lng };
      } else {
        throw new Error("No location data found.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#1c1c1c] font-['Dosis'] text-center mb-12">
          Tambahkan Informasi Toko
        </h1>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            {/* Nama Toko */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label
                htmlFor="storeName"
                className="w-32 text-black text-base font-medium font-['Dosis']"
              >
                Nama Toko
              </label>
              <div className="flex-1">
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-white rounded-md border border-slate-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-600 transition duration-200 ${
                             isLoading ? "opacity-50 cursor-not-allowed" : ""
                           }`}
                  placeholder="Masukkan nama toko"
                />
                {errorMessages.storeName && (
                  <div className="text-red-500 text-sm mt-2">
                    {errorMessages.storeName}
                  </div>
                )}
              </div>
            </div>

            {/* Alamat */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label
                htmlFor="address"
                className="w-32 text-black text-base font-medium font-['Dosis']"
              >
                Alamat
              </label>
              <div className="flex-1">
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-white rounded-md border border-slate-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-600 transition duration-200 ${
                             isLoading ? "opacity-50 cursor-not-allowed" : ""
                           }`}
                  placeholder="Masukkan alamat toko"
                />
                {errorMessages.address && (
                  <div className="text-red-500 text-sm mt-2">
                    {errorMessages.address}
                  </div>
                )}
              </div>
            </div>

            {/* Kontak */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label
                htmlFor="contact"
                className="w-32 text-black text-base font-medium font-['Dosis']"
              >
                Kontak
              </label>
              <div className="flex-1">
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-white rounded-md border border-slate-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-600 transition duration-200  ${
                             isLoading ? "opacity-50 cursor-not-allowed" : ""
                           }`}
                  placeholder="Masukkan nomor kontak"
                />
              </div>
            </div>

            {/* Jam Buka */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label
                htmlFor="openingHours"
                className="w-32 text-black text-base font-medium font-['Dosis']"
              >
                Jam Buka
              </label>
              <div className="flex-1">
                <input
                  id="openingHours"
                  name="openingHours"
                  type="text"
                  value={formData.openingHours}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-white rounded-md border border-slate-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-600 transition duration-200 ${
                             isLoading ? "opacity-50 cursor-not-allowed" : ""
                           }`}
                  placeholder="Contoh: 08:00 - 21:00"
                />
              </div>
            </div>

            {/* Upload Foto */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="w-32 text-black text-base font-medium font-['Dosis']">
                Foto
              </label>
              <div className="flex items-center gap-4">
                <FileUploadButton onFileSelect={handleImageChange}>
                  Pilih Foto
                </FileUploadButton>
                {imageUrl && (
                  <div className="font-['Dosis'] text-m text-black">
                    Image Preview:
                    <Image
                      src={imageUrl}
                      alt="Selected Image"
                      width={200}
                      height={200}
                    />
                    {imageName && <p>Nama File: {imageName}</p>}
                  </div>
                )}
                {errorMessages.imageUrl && (
                  <div className="text-red-500 text-sm mt-2">
                    {errorMessages.imageUrl}
                  </div>
                )}
              </div>
            </div>

            {/* Deskripsi */}
            <div className="flex flex-col sm:flex-row gap-4">
              <label
                htmlFor="description"
                className="w-32 text-black text-base font-medium font-['Dosis']"
              >
                Deskripsi
              </label>
              <div className="flex-1">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-2 bg-white rounded-md border border-slate-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-600 resize-none transition duration-200 ${
                             isLoading ? "opacity-50 cursor-not-allowed" : ""
                           }`}
                  placeholder="Masukkan deskripsi toko"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <DefaultButton onClick={handleSubmit}>Tambahkan Toko</DefaultButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStore;
