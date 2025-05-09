'use client';
import { UserIcon } from '@heroicons/react/16/solid';
import { ArrowRightStartOnRectangleIcon, TicketIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const userRememberMe = localStorage.getItem('rememberMe');
    let loggedIn = false;
    let picture = null;

    if (userRememberMe === 'true') {
      loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      picture = localStorage.getItem('profile_picture');
    } else {
      loggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
      picture = sessionStorage.getItem('profile_picture');
    }

    setIsLoggedIn(loggedIn);
    setProfilePicture(picture);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('userLoggedIn');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userMail');
    sessionStorage.removeItem('account_type');
    sessionStorage.removeItem('profile_picture');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    localStorage.removeItem('userMail');
    localStorage.removeItem('account_type');
    localStorage.removeItem('profile_picture');

    setIsLoggedIn(false);
    setDropdownOpen(false);
    window.location.href = '/login';
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className='flex flex-row items-center bg-primary'>
      <Link href='/'>
        <img src='/assets/images/buszy_logo.png' alt="Buszy Logo" className='h-24 ml-8' />
      </Link>

      {!isLoggedIn ? (
        <>
          <Link href='/login' className='ml-auto'>
            <button className='rounded-full font-sans font-semibold text-white text-2xl py-2 px-4 mr-4 hover:text-primarybr cursor-pointer transition duration-300'>
              Login
            </button>
          </Link>
          <Link href='/signup'>
            <button className='rounded-full font-sans font-semibold text-white text-2xl bg-primarybr py-2 px-4 mr-8 hover:text-primarybr hover:bg-white cursor-pointer transition duration-300'>
              Signup
            </button>
          </Link>
        </>
      ) : (
        <div className='ml-auto mr-10 flex items-center'>
          <div className="relative">
            <img
              src={
                profilePicture && profilePicture !== "null"
                  ? `data:image/png;base64,${profilePicture}`
                  : '/assets/images/profileicon.png'
              }
              alt='Profile'
              className='h-12 w-12 rounded-full cursor-pointer'
              onClick={toggleDropdown}
            />


            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 z-50">
                <ul className="py-2">
                  <li>
                    <Link href='/profile' className="px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link href='/my_tickets' className="flex px-4 py-2 text-gray-700 hover:bg-gray-200">
                      <TicketIcon className="h-5 w-5 mr-2 text-gray-500" />
                      My Tickets
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200 items-center"
                    >
                      <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-2 text-red-600" />
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
