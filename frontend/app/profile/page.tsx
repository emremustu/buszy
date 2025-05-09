'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import {
  ArrowRightEndOnRectangleIcon,
  EnvelopeIcon,
  PhoneIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import Footer from '../components/Footer';
import { handleLogout } from '../utils/auth';

const ProfilePage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal kontrolü

  useEffect(() => {
    const isLoggedIn =
      sessionStorage.getItem('userLoggedIn') === 'true' ||
      localStorage.getItem('userLoggedIn') === 'true';
    const userId =
      sessionStorage.getItem('userId') || localStorage.getItem('userId');

    if (!isLoggedIn || !userId) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:8000/api/get-user-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setUserInfo(data.user_info);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      user_id: userInfo[0]
    };

    try {
      const response = await fetch("http://localhost:8000/api/delete-account", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        localStorage.removeItem('userMail');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        localStorage.removeItem('account_type');

        sessionStorage.removeItem('userLoggedIn');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userMail');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('account_type');

        router.push('/');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin." + error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex flex-col'>
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          {loading ? (
            <p>Loading user info...</p>
          ) : userInfo ? (
            <div className="w-full max-w-5xl flex flex-col items-center gap-10">
              <div className="flex w-full justify-between items-start flex-wrap gap-6">
                {/* Left: Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-black">
                    <img
                      src="assets/images/profileicon.png"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="bg-orange-400 hover:bg-orange-500 text-white text-sm px-4 py-1 rounded">
                      Change Picture
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded">
                      Delete Picture
                    </button>
                  </div>
                </div>

                {/* Center: User Info */}
                <div className="flex flex-col items-start text-lg font-medium space-y-1">
                  <p><strong>Name:</strong> {userInfo[1]}</p>
                  <p><strong>Surname:</strong> {userInfo[2]}</p>
                  <p><strong>Mail:</strong> {userInfo[3]}</p>
                  <p><strong>Account Type:</strong> {userInfo[6]}</p>
                  <p><strong>Registration Date:</strong> {new Date(userInfo[5]).toLocaleString()}</p>
                </div>

                {/* Right: Buttons */}
                <div className="flex flex-col gap-3">
                  <Link href={'/my_tickets'} className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded">
                    My Tickets
                  </Link>
                  <button onClick={handleLogout}
                    className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                    Log Out
                  </button>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex justify-between w-full">
                <div></div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded flex items-center gap-2 cursor-pointer"
                >
                  <TrashIcon className="h-5 w-5" />
                  Delete Account
                </button>
                <button className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5" />
                  Contact Us
                </button>
              </div>
            </div>
          ) : (
            <p>No user data found.</p>
          )}
        </div>
        <Footer />
      </div>

      {/* Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">This action will permanently delete your account. This cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  setShowDeleteModal(false);
                  handleDeleteAccount(e);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
