"use client";
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import DefaultButton from '../components/defaultButton';

const AddStore = () => {
    const [formData, setFormData] = useState({
        storeName: '',
        address: '',
        contact: '',
        openingHours: '',
        description: '',
        image: null as File | null
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleSubmit = () => {
        // Handle form submission here
        console.log(formData);
    };

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
                                    className="w-full px-4 py-2 bg-white rounded-md border border-slate-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-600 transition duration-200"
                                    placeholder="Masukkan nama toko"
                                />
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
                                    className="w-full px-4 py-2 bg-white rounded-md border border-slate-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-600 transition duration-200"
                                    placeholder="Masukkan alamat toko"
                                />
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
                                    className="w-full px-4 py-2 bg-white rounded-md border border-slate-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-600 transition duration-200"
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
                                    className="w-full px-4 py-2 bg-white rounded-md border border-slate-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-600 transition duration-200"
                                    placeholder="Contoh: 08:00 - 21:00"
                                />
                            </div>
                        </div>

                        {/* Upload Foto */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <label
                                className="w-32 text-black text-base font-medium font-['Dosis']"
                            >
                                Foto
                            </label>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="imageUpload"
                                />
                                <label
                                    htmlFor="imageUpload"
                                    className="inline-block px-6 py-2 bg-[#1c1c1c] text-white text-sm font-bold 
                           font-['Dosis'] rounded cursor-pointer hover:bg-gray-800 
                           transition duration-200"
                                >
                                    Upload Foto
                                </label>
                                {formData.image && (
                                    <span className="ml-4 text-gray-600">
                                        {formData.image.name}
                                    </span>
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
                                    className="w-full px-4 py-2 bg-white rounded-md border border-slate-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-600 resize-none transition duration-200"
                                    placeholder="Masukkan deskripsi toko"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <DefaultButton onClick={handleSubmit}>
                            Tambahkan Toko
                        </DefaultButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStore;