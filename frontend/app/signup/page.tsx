"use client";
import Navbar from '../components/Navbar';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordRepeatVisible, setPasswordRepeatVisible] = useState(false);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'companies' | 'individuals'>('individuals');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    const data = {
      name: selectedOption === 'companies' ? companyName : name,
      last_name: selectedOption === 'individuals' ? lastName : '',
      email,
      password,
      account_type:selectedOption,
    };

    // POST request to send the data
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
        if (rememberMe) {
          // Store the user's info (e.g., user_id or token) permanently in localStorage
          
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userId', result.user_id); // Assuming result contains user_id
          if(selectedOption=='companies'){
            localStorage.setItem('company',companyName);
          }
        } else {
          // Store the user's info for the session in sessionStorage
          sessionStorage.setItem('rememberMe', 'false');
          sessionStorage.setItem('userLoggedIn', 'true');
          sessionStorage.setItem('userId', result.user_id); // Assuming result contains user_id
          if(selectedOption=='companies'){
            sessionStorage.setItem('company',companyName);
          }
        }
        router.push('/');
      } else {
        alert(result.message || "An error occurred!"); // Show error message
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("An error occurred, please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-row w-full justify-center">
        <div className="flex flex-col items-center mb-20">
          <h1 className="text-3xl font-bold mb-5 text-primary mt-12">Signup</h1>
          <div className="flex my-6 w-full rounded-2xl">
            <div
              className={`w-1/2 py-2 text-center cursor-pointer rounded-2xl text-2xl transition-all duration-300 ${selectedOption === 'companies' ? 'bg-green-500 text-white' : 'text-green-500'}`}
              onClick={() => setSelectedOption('companies')}
            >
              For companies
            </div>
            <div
              className={`w-1/2 py-2 text-center cursor-pointer rounded-2xl text-2xl transition-all duration-300 ${selectedOption === 'individuals' ? 'bg-green-500 text-white' : 'text-green-500'}`}
              onClick={() => setSelectedOption('individuals')}
            >
              For individuals
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-[48rem] bg-white shadow-2xl rounded-3xl p-8 grid grid-cols-2 gap-6">
            {/* Conditionally render Name and Last Name or Company Name */}
            {selectedOption === 'individuals' ? (
              <>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-lg font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
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
              </>
            ) : (
              <div className="mb-6 col-span-2">
                <label htmlFor="companyName" className="block text-lg font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  placeholder="Type your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}

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
              <div className="form-control flex flex-row items">
                <label className="label cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-primary h-4 w-4" checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)} />
                  <span className="label-text font-sans text-sm ml-2">Remember me</span>
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
