'use client'
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Tarayıcıda olduğumuzu kontrol et
    if (typeof window !== 'undefined') {
      const userLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true' || localStorage.getItem('userLoggedIn') === 'true';
      
      if (!userLoggedIn) {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        router.push('/login');
      }
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <div>Profil Sayfası İçeriği</div>
    </>
  );
};

export default ProfilePage;
