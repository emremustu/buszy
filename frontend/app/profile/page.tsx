'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import {
  ArrowRightEndOnRectangleIcon,
  EnvelopeIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import Footer from '../components/Footer';
import { handleLogout } from '../utils/auth';

const ProfilePage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
      user_id: userInfo.id,
    };

    try {
      const response = await fetch("http://localhost:8000/api/delete-account", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.clear();
        sessionStorage.clear();
        router.push('/');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin. " + error);
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
                      src={
                        userInfo.image
                          ? `data:image/png;base64,${userInfo.image}`
                          : "assets/images/profileicon.png"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-orange-400 hover:bg-orange-500 text-white text-sm px-4 py-1 rounded"
                    >
                      Change Picture
                    </button>
                  </div>
                </div>

                {/* Center: User Info */}
                <div className="flex flex-col items-start text-lg font-medium space-y-1">
                  <p><strong>Name:</strong> {userInfo.name}</p>
                  <p><strong>Surname:</strong> {userInfo.last_name}</p>
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>Account Type:</strong> {userInfo.account_type}</p>
                  <p><strong>Last Login:</strong> {new Date(userInfo.last_login).toLocaleString()}</p>
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
                {/* <button className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5" />
                  Contact Us
                </button> */}
              </div>
            </div>
          ) : (
            <p>No user data found.</p>
          )}
        </div>
        <Footer />
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
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

      {/* Upload Image Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Upload New Profile Picture</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!selectedFile || !userInfo?.id) return;

                  setUploading(true);
                  const formData = new FormData();
                  formData.append('user_id', userInfo.id);
                  formData.append('image', selectedFile);

                  try {
                    const res = await fetch('http://localhost:8000/api/add-or-update-image', {
                      method: 'POST',
                      body: formData,
                    });

                    const result = await res.json();
                    if (result.success && selectedFile) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = (reader.result as string).split(',')[1];
                        const rememberMe = localStorage.getItem('rememberMe') === 'true';

                        if (rememberMe) {
                          localStorage.setItem('profile_picture', base64);
                        } else {
                          sessionStorage.setItem('profile_picture', base64);
                        }

                        setShowUploadModal(false);
                        setSelectedFile(null);
                        window.location.reload();
                      };
                      reader.readAsDataURL(selectedFile);
                    } else {
                      alert(result.message || "Upload failed.");
                    }
                  } catch (err) {
                    console.error(err);
                    alert("An error occurred while uploading.");
                  } finally {
                    setUploading(false);
                  }
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
