'use client'
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import DefaultButton from "../components/defaultButton";

const doNothing = () => {};

const EditProfile = () => {
  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    username: 'username',
    email: 'emailbaru@email.com',
    address: 'alamat baru',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Fungsi untuk menangani perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };  

  // Fungsi untuk menangani submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }
    console.log('Data Form:', formData);
    alert('Perubahan berhasil disimpan! Periksa console untuk melihat data.');
  };

  return (
    <div className="w-full h-full relative bg-white">
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="w-[870px] h-[630px] left-[311px] top-[231px] absolute bg-white rounded-[20px] shadow"
      >
        <div className="left-[80px] top-[40px] absolute text-[#22577a] text-xl font-medium font-['Dosis'] leading-7">
          Edit Informasi Profile
        </div>

        {/* Username */}
        <div className="w-[703px] left-[80px] top-[84px] absolute justify-start items-start gap-[50px] inline-flex">
          <div className="w-[703px] flex-col justify-start items-start gap-2 inline-flex">
            <div className="text-black text-base font-normal font-['Dosis'] leading-normal">
              Username
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-[703px] h-[50px] bg-neutral-100 rounded px-4"
            />
          </div>
        </div>

        {/* Email dan Alamat */}
        <div className="left-[80px] top-[190px] absolute justify-start items-start gap-[50px] inline-flex">
          <div className="flex-col justify-start items-start gap-2 inline-flex">
            <div className="text-black text-base font-normal font-['Dosis'] leading-normal">
              Email
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-[330px] h-[50px] bg-neutral-100 rounded px-4"
            />
          </div>
          <div className="flex-col justify-start items-start gap-2 inline-flex">
            <div className="text-black text-base font-normal font-['Dosis'] leading-normal">
              Alamat
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-[330px] h-[50px] bg-neutral-100 rounded px-4"
            />
          </div>
        </div>

        {/* Password */}
        <div className="left-[80px] top-[296px] absolute flex-col justify-start items-start gap-4 inline-flex">
          <div className="flex-col justify-start items-start gap-2 flex">
            <div className="text-black text-base font-normal font-['Dosis'] leading-normal">
              Ganti Password
            </div>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-[710px] h-[50px] bg-neutral-100 rounded px-4"
            />
          </div>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-[710px] h-[50px] bg-neutral-100 rounded px-4"
          />
          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className="w-[710px] h-[50px] bg-neutral-100 rounded px-4"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="left-[513px] top-[534.50px] absolute justify-start items-center gap-8 inline-flex">
          <button
            type="button"
            className="text-black text-base font-normal font-['Dosis'] leading-normal"
            onClick={() => alert('Perubahan dibatalkan!')}
          >
            Batalkan
          </button>
        <DefaultButton onClick={doNothing}>Simpan Perubahan</ DefaultButton>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
