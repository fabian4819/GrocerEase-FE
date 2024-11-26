'use client';
'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import RegisterButton from "../components/registerButton";

interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  address: string;
}

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterForm>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_AUTH}api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          address: formData.address
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      router.push('/login');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.name === 'AbortError' ? 'Request timeout' : err.message);
      } else {
        setError('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-cover bg-center bg-[url('/img/background.jpg')]">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-[90%] max-w-[426px] bg-neutral-100 p-6 rounded-lg shadow-lg">
          <h1 className="text-center mb-6 text-[#22577a] text-[49.77px] font-semibold font-['Dosis']">
            Daftar Akun
          </h1>
          {error && (
            <div className="text-red-500 text-center mb-4 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="w-[80%] mx-auto mb-6">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@mail.com"
                className={`w-full h-12 bg-neutral-100 border-b border-[#393a41] pl-[14px] text-[#747680] text-2xl font-light font-['Dosis'] focus:outline-none transition-colors duration-200
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
                disabled={isLoading}
              />
            </div>
            <div className="w-[80%] mx-auto mb-6">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className={`w-full h-12 bg-neutral-100 border-b border-[#393a41] pl-[14px] text-[#747680] text-2xl font-light font-['Dosis'] focus:outline-none transition-colors duration-200
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
                disabled={isLoading}
              />
            </div>
            <div className="w-[80%] mx-auto mb-6">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full h-12 bg-neutral-100 border-b border-[#393a41] pl-[14px] text-[#747680] text-2xl font-light font-['Dosis'] focus:outline-none transition-colors duration-200
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
                disabled={isLoading}
              />
            </div>
            <div className="w-[80%] mx-auto mb-6">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full h-12 bg-neutral-100 border-b border-[#393a41] pl-[14px] text-[#747680] text-2xl font-light font-['Dosis'] focus:outline-none transition-colors duration-200
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
                disabled={isLoading}
              />
            </div>
            <div className="w-[80%] mx-auto mb-6">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className={`w-full h-12 bg-neutral-100 border-b border-[#393a41] pl-[14px] text-[#747680] text-2xl font-light font-['Dosis'] focus:outline-none transition-colors duration-200
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
                disabled={isLoading}
              />
            </div>
            <div className="w-[80%] mx-auto">
              <button
                type="submit"
                className={`w-full relative ${isLoading ? 'cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#22577a] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <RegisterButton />
                )}
              </button>
            </div>
            <div className="w-[80%] mx-auto mt-4 text-center">
              <p className="text-[#747680]">
                Already have an account?{' '}
                <span
                  className="text-[#22577a] cursor-pointer hover:underline"
                  onClick={() => router.push('/login')}
                >
                  Login here
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;