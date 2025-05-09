'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import Footer from '../components/Footer';

const MyTicketsPage = () => {
    const router = useRouter();
    const [userID, setUserId] = useState('');
    const [tickets, setTickets] = useState<any[]>([]);
    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [comments, setComments] = useState<{ [key: number]: string }>({});
    const [submitted, setSubmitted] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const userLoggedIn =
            sessionStorage.getItem('userLoggedIn') === 'true' ||
            localStorage.getItem('userLoggedIn') === 'true';
        const rememberMe = localStorage.getItem('rememberMe') === 'true';

        if (!userLoggedIn) {
            router.push('/login');
            return;
        }

        let userId = rememberMe
            ? localStorage.getItem('userId') ?? '0'
            : sessionStorage.getItem('userId') ?? '0';

        setUserId(userId);

        const fetchTickets = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/get-tickets-by-user-id', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });

                const result = await response.json();
                if (result.status === 'success' && Array.isArray(result.tickets)) {
                    setTickets(result.tickets);
                } else {
                    setTickets([]);
                }
            } catch (error) {
                console.error('An error occurred while fetching tickets:', error);
            }
        };

        fetchTickets();
    }, []);

    // Her ticket için ayrı ayrı yorumları çek
    useEffect(() => {
        if (tickets.length === 0) return;

        const fetchCommentsForTickets = async () => {
            const loadedRatings: { [key: number]: number } = {};
            const loadedComments: { [key: number]: string } = {};
            const loadedSubmitted: { [key: number]: boolean } = {};

            await Promise.all(
                tickets.map(async (ticket) => {
                    const ticketId = Number(ticket[0]);

                    try {
                        const response = await fetch('http://localhost:8000/api/see-comment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ticket_id: ticketId }),
                        });

                        const result = await response.json();
                        if (result.status === 'success' && Array.isArray(result.comment) && result.comment.length > 0) {
                            const comment = result.comment[0];
                            loadedRatings[ticketId] = Number(comment[1]);
                            loadedComments[ticketId] = comment[3];
                            loadedSubmitted[ticketId] = true;
                        }
                    } catch (error) {
                        console.error(`Error fetching comment for ticket ${ticketId}:`, error);
                    }
                })
            );

            setRatings(loadedRatings);
            setComments(loadedComments);
            setSubmitted(loadedSubmitted);
        };

        fetchCommentsForTickets();
    }, [tickets]);

    const handleStarClick = (ticketId: number, rating: number) => {
        setRatings((prev) => ({ ...prev, [ticketId]: rating }));
    };

    const handleCommentChange = (ticketId: number, value: string) => {
        setComments((prev) => ({ ...prev, [ticketId]: value }));
    };

    const handleSubmit = async (ticketId: number) => {
        const rate = ratings[ticketId];
        const comment = comments[ticketId];
        if (!rate || !comment) return;

        try {
            const response = await fetch('http://localhost:8000/api/add-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rate: String(rate),
                    user_id: userID,
                    ticket_id: String(ticketId),
                    user_comment: comment,
                }),
            });

            if (response.ok) {
                // Yorumu tekrar getir
                const refresh = await fetch('http://localhost:8000/api/see-comment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticket_id: ticketId }),
                });

                const result = await refresh.json();
                if (result.status === 'success' && Array.isArray(result.comment) && result.comment.length > 0) {
                    const updated = result.comment[0];
                    setRatings((prev) => ({ ...prev, [ticketId]: Number(updated[1]) }));
                    setComments((prev) => ({ ...prev, [ticketId]: updated[3] }));
                    setSubmitted((prev) => ({ ...prev, [ticketId]: true }));
                }
            } else {
                console.error('Yorum gönderilemedi');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const isPastDate = (dateStr: string) => {
        const today = new Date();
        const ticketDate = new Date(dateStr);
        return ticketDate < today;
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-5 mt-12">My Tickets</h1>

                <ul className="w-full max-w-4xl space-y-6 mb-10">
                    {tickets.map((ticket, index) => {
                        const ticketId = Number(ticket[0]);
                        const hasDeparted = isPastDate(ticket[4]);

                        return (
                            <li
                                key={index}
                                className="relative flex mx-4 md:mx-0 flex-col items-center justify-between bg-white shadow-md border rounded-2xl px-6 py-4 overflow-hidden"
                            >
                                <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border" />
                                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border" />

                                <div className="md:w-1/5 w-full text-center mb-4 md:mb-0">
                                    <p className="text-sm text-gray-500">Company</p>
                                    <p className="md:text-lg text-sm font-semibold">{ticket[7]}</p>
                                </div>

                                <div className="flex flex-wrap justify-around flex-1 gap-4 text-center">
                                    <div><p className="text-sm text-gray-500">From</p><p className="md:text-lg">{ticket[2]}</p></div>
                                    <div><p className="text-sm text-gray-500">To</p><p className="md:text-lg">{ticket[3]}</p></div>
                                    <div><p className="text-sm text-gray-500">Date</p><p className="md:text-lg">{ticket[4]}</p></div>
                                    <div><p className="text-sm text-gray-500">Time</p><p className="md:text-lg">{ticket[5]}</p></div>
                                    <div><p className="text-sm text-gray-500">Seat</p><p className="md:text-lg">{ticket[6]}</p></div>
                                </div>

                                <div className="mt-4 w-full flex flex-col items-center">
                                    {hasDeparted ? (
                                        submitted[ticketId] ? (
                                            <div className="w-full text-center">
                                                <p className="text-gray-700 font-semibold">Yorumunuz:</p>
                                                <p className="italic text-gray-600 mt-1 mb-2">{comments[ticketId]}</p>
                                                <div className="flex justify-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={`text-2xl ${ratings[ticketId] >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        >★</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-center space-x-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            onClick={() => handleStarClick(ticketId, star)}
                                                            className={`cursor-pointer text-2xl ${ratings[ticketId] >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        >★</span>
                                                    ))}
                                                </div>
                                                {ratings[ticketId] && (
                                                    <div className="mt-3 w-full">
                                                        <textarea
                                                            maxLength={255}
                                                            rows={3}
                                                            placeholder="Yorumunuzu yazın (max 255 karakter)"
                                                            className="w-full border rounded-md p-2 resize-none"
                                                            value={comments[ticketId] || ''}
                                                            onChange={(e) =>
                                                                handleCommentChange(ticketId, e.target.value)
                                                            }
                                                        />
                                                        <button
                                                            onClick={() => handleSubmit(ticketId)}
                                                            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                                                        >
                                                            Gönder
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )
                                    ) : (
                                        <div className="flex flex-col md:flex-row gap-3 mt-4">
                                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">İptal Et</button>
                                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">Açığa Al</button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className='mt-auto'></div>
            <Footer></Footer>
        </div>
    );
};

export default MyTicketsPage;
