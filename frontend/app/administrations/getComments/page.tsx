'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const CompanyCommentsPage = () => {
    const [comments, setComments] = useState<any[]>([]);
    const companyName = localStorage.getItem('name') ?? sessionStorage.getItem('name');

    useEffect(() => {
        if (companyName) {
            fetchComments();
        }
    }, [companyName]);

    const fetchComments = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/get-comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company: companyName }),
            });

            const result = await response.json();

            if (result.success && Array.isArray(result.comment)) {
                setComments(result.comment);
            } else {
                setComments([]);
            }
        } catch (error) {
            console.error('Yorumlar alınırken hata oluştu:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-col items-center mt-12">
                <h1 className="text-2xl font-bold mb-6">Customer Comments</h1>

                {comments.length === 0 ? (
                    <p className="text-gray-500">There is no comments yet.</p>
                ) : (
                    <ul className="w-full max-w-4xl space-y-4 px-4 mb-10">
                        {comments.map((comment, index) => (
                            <li
                                key={index}
                                className="bg-white border rounded-lg shadow-md p-4 transform transition duration-300 hover:scale-105 hover:shadow-lg"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold">User ID: {comment.user_id}</p>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`text-xl ${comment.rate >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="italic text-gray-800 mb-2">"{comment.user_comment}"</p>

                                <div className="text-sm text-gray-600 space-y-1">                                 
                                    <p><strong>Origin:</strong> {comment.origin} | <strong>Destination:</strong> {comment.destination}</p>
                                    <p><strong>Date:</strong> {comment.voyage_date} - <strong>Time:</strong> {comment.voyage_time}</p>
                                    <p><strong>Seat:</strong> {comment.seat}</p>
                                    
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="mt-auto"></div>
            <Footer />
        </div>
    );
};

export default CompanyCommentsPage;
