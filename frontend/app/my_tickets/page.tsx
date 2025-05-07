'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation';

const MyTicketsPage = () => {
    const router = useRouter();
    const [userID, setUserId] = useState('');
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const userLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true' || localStorage.getItem('userLoggedIn') === 'true';
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
        if (!userLoggedIn) {
            router.push('/login');
            return;
        }
    
        let userId = '0';
        if (rememberMe) {
            userId = localStorage.getItem('userId') ?? '0';
        } else {
            userId = sessionStorage.getItem('userId') ?? '0';
        }
    
        setUserId(userId); // sadece görüntülemek için, fetch'te kullanma
    
        const fetchTickets = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/get-tickets-by-user-id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }), // DİKKAT: burada doğrudan değişkeni kullanıyoruz
                });
    
                const result = await response.json();
    
                if (result.status === 'success' && Array.isArray(result.tickets)) {
                    setTickets(result.tickets);
                } else {
                    console.error('Ticket fetch failed or tickets not array:', result);
                    setTickets([]); // güvenli fallback
                }
            } catch (error) {
                console.log("An error occurred:", error);
            }
        };
    
        fetchTickets();
    }, []);
    

    return (
        <>
            <div className='flex flex-col'>
                <Navbar />
                <div className='flex flex-col items-center'>
                    <h1 className="text-3xl font-bold mb-5 mt-12">My Tickets</h1>

                    {tickets.length === 0 ? (
                        <p>No tickets found.</p>
                    ) : (
                        <ul className='w-full max-w-4xl space-y-4'>
    {tickets.map((ticket, index) => (
        <li
            key={index}
            className='border rounded-2xl shadow-lg p-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 bg-white'
        >
            <div className='flex-1 text-center'>
                <p className='text-sm text-gray-500'>From</p>
                <p className='text-lg '>{ticket[2]}</p>
            </div>

            <div className='flex-1 text-center'>
                <p className='text-sm text-gray-500'>To</p>
                <p className='text-lg '>{ticket[3]}</p>
            </div>

            <div className='flex-1 text-center'>
                <p className='text-sm text-gray-500'>Date</p>
                <p className='text-lg '>{ticket[4]}</p>
            </div>

            <div className='flex-1 text-center'>
                <p className='text-sm text-gray-500'>Time</p>
                <p className='text-lg '>{ticket[5]}</p>
            </div>

            <div className='flex-1 text-center'>
                <p className='text-sm text-gray-500'>Seat</p>
                <p className='text-lg '>{ticket[6]}</p>
            </div>

            <div className='flex-1 text-center'>
                <p className='text-sm text-gray-500'>Company</p>
                <p className='text-lg '>{ticket[7]}</p>
            </div>
        </li>
    ))}
</ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyTicketsPage;
