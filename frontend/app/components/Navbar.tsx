'use client';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      // Check login status when the component mounts
      const userRememberMe= localStorage.getItem('rememberMe');
    if(userRememberMe === 'true'){
       const loggedIn=localStorage.getItem('userLoggedIn');
       setIsLoggedIn(loggedIn === 'true');
    }
    else{
        const loggedIn=sessionStorage.getItem('userLoggedIn');
        setIsLoggedIn(loggedIn==='true');
    }


      

    }, []);
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
              <Link href='/profile'>
                <img src='/assets/images/profileicon.png' alt='Profile' className='h-12 w-12 rounded-full' />
              </Link>
            </div>
          )}
        </div>
      );
}

export default Navbar
