'use client';
import { UserIcon } from '@heroicons/react/16/solid';
import { ArrowRightStartOnRectangleIcon, TicketIcon } from '@heroicons/react/24/solid';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'


const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown menüsünün açık olup olmadığını kontrol eder

  useEffect(() => {
    // Check login status when the component mounts
    const userRememberMe = localStorage.getItem('rememberMe');
    if (userRememberMe === 'true') {
      const loggedIn = localStorage.getItem('userLoggedIn');
      setIsLoggedIn(loggedIn === 'true');
    } else {
      const loggedIn = sessionStorage.getItem('userLoggedIn');
      setIsLoggedIn(loggedIn === 'true');
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Dropdown menüsünü açıp kapatır
  }

  return (
    <div className='flex flex-row items-center bg-primary'>
      <Link href='/'>
        <img src='/assets/images/buszy_logo.png' alt="Marpus'a Hoşgeldiniz!" className='h-24 ml-8' />
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
            {/* Avatar tıklanabilir olacak */}
            <img
              src='/assets/images/profileicon.png'
              alt='Profile'
              className='h-12 w-12 rounded-full cursor-pointer'
              onClick={toggleDropdown} // Avatar tıklandığında dropdown menüsünü açar
            />
            
            {/* Dropdown menüsü */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48">
                <ul className="py-2">
                  <li>
                    <Link href='/profile' className=" px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center">
                      {/* UserIcon'ı ekliyoruz */}
                      <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link href='/my_tickets' className="flex px-4 py-2 text-gray-700 hover:bg-gray-200">
                    <TicketIcon className="h-5 w-5 mr-2 text-gray-500"></TicketIcon>
                      My Tickets
                    </Link>
                  </li>
                  <li>
                    
                    <Link href='/login' className="flex px-4 py-2 text-red-600 hover:bg-gray-200">
                    <ArrowRightStartOnRectangleIcon  className="h-5 w-5 mr-2 text-red-600" ></ArrowRightStartOnRectangleIcon>
                      Log Out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
