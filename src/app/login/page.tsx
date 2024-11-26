'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import LoginButton from '../components/loginButton';

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_AUTH}api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="w-full h-screen bg-cover bg-center bg-[url('/img/background.jpg')]">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-[90%] max-w-[426px] bg-neutral-100 p-6 rounded-lg shadow-lg">
          <h1 className="text-center mb-6 text-[#22577a] text-[49.77px] font-semibold font-['Dosis']">
            Masuk ke Dashboard
          </h1>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="w-[80%] mx-auto mb-6">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@mail.com"
                className="w-full h-12 bg-neutral-100 border-b border-[#393a41] pl-[14px] text-[#747680] text-2xl font-light font-['Dosis'] focus:outline-none"
                required
              />
            </div>
            <div className="w-[80%] mx-auto mb-6">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="password"
                className="w-full h-12 bg-neutral-100 border-b border-[#393a41] pl-[14px] text-[#747680] text-2xl font-light font-['Dosis'] focus:outline-none"
                required
              />
            </div>
            <div className="w-[80%] mx-auto">
              <button
                type="submit"
                className="w-full"
              >
                <LoginButton />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;