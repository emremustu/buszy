"use client";
import Navbar from '../components/Navbar'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import Footer from '../components/Footer';
import Link from 'next/link';

const SignupPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordRepeatVisible, setPasswordRepeatVisible] = useState(false);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Formun sayfa yenilenmesini engelle
    
    const data = {
      name,
      last_name: lastName,
      email,
      password,
    };

    // POST isteği gönderme
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert("Kayıt başarılı!");
      } else {
        alert(result.message || "Bir hata oluştu!"); // Hata mesajını burada göster
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-row w-full justify-center">
        <div className="flex flex-col items-center mb-20">
          <h1 className="text-3xl font-bold mb-5 text-primary mt-12">Signup</h1>
          <form onSubmit={handleSubmit} className="w-[48rem] bg-white shadow-2xl rounded-3xl p-8 grid grid-cols-2 gap-6">
            <div className="mb-6">
              <label htmlFor="firstName" className="block text-lg font-medium mb-2">Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="Type your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="lastName" className="block text-lg font-medium mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Type your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="mb-6 col-span-2">
              <label htmlFor="email" className="block text-lg font-medium mb-2">E-Mail</label>
              <input
                type="email"
                id="email"
                placeholder="Type your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Type your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute top-11 right-3 text-gray-500 hover:text-gray-700"
              >
                {passwordVisible ? <EyeIcon className="h-6 w-6" /> : <EyeSlashIcon className="h-6 w-6" />}
              </button>
            </div>
            <div className="mb-6 relative">
              <label htmlFor="passwordRepeat" className="block text-lg font-medium mb-2">Confirm Password</label>
              <input
                type={passwordRepeatVisible ? "text" : "password"}
                id="passwordRepeat"
                placeholder="Type your password again"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => setPasswordRepeatVisible(!passwordRepeatVisible)}
                className="absolute top-11 right-3 text-gray-500 hover:text-gray-700"
              >
                {passwordRepeatVisible ? <EyeIcon className="h-6 w-6" /> : <EyeSlashIcon className="h-6 w-6" />}
              </button>
            </div>
            <div className="mb-1 col-span-2">
              <div className="form-control flex flex-row mt-2">
                <label className="label cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-primary h-4 w-4" />
                  <span className="label-text font-sans text-sm ml-2">I have read and accept the terms of use.</span>
                </label>
              </div>
              <div className="form-control flex flex-row items">
                <label className="label cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-primary h-4 w-4" />
                  <span className="label-text font-sans text-sm ml-2">I have read and approved the KVKK text.</span>
                </label>
              </div>
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primarybr cursor-pointer transition duration-300"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignupPage;
