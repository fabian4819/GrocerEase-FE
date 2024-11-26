'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';

const EditProfile = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false); // Tracks the loading state
  const [error, setError] = useState(''); // Tracks error messages
  const [success, setSuccess] = useState(false); // Tracks success messages


  useEffect(() => {
    // Access localStorage in the client environment
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setFormData({
        username: user.username || '',
        email: user.email || '',
        address: user.address || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    }
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setSuccess(false);
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('Password baru dan konfirmasi password tidak cocok!');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_AUTH}/api/auth/editProfile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          address: formData.address,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess(true); // Indicates success
    } catch (err) {
      if (err instanceof Error) {
        setError(err.name === 'AbortError' ? 'Request timeout' : err.message);
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[1024px] relative bg-cover bg-white">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="w-[870px] h-[630px] relative bg-white rounded-[20px] shadow"
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
                className="w-[703px] h-[50px] bg-neutral-100 rounded px-4 text-gray-600 text-lg font-normal font-[Dosis]"
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
                className="w-[330px] h-[50px] bg-neutral-100 rounded px-4 text-gray-600 text-lg font-normal font-[Dosis]"
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
                className="w-[330px] h-[50px] bg-neutral-100 rounded px-4  text-gray-600 text-lg font-normal font-[Dosis]"
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
                className="w-[710px] h-[50px] bg-neutral-100 rounded px-4  text-gray-600 text-lg font-normal font-[Dosis]"
              />
            </div>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-[710px] h-[50px] bg-neutral-100 rounded px-4 text-gray-600 text-lg font-normal font-[Dosis]"
            />
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="w-[710px] h-[50px] bg-neutral-100 rounded px-4  text-gray-600 text-lg font-normal font-[Dosis]"
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
            <button
              type="submit"
              className="w-[200px] h-[50px] bg-[#22577a] text-white text-lg font-normal font-['Dosis'] rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;