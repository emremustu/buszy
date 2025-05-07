'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";  // Navbar'ı ekliyoruz
import Footer from "../components/Footer"; // Footer'ı ekliyoruz

const TicketPage = () => {
    const searchParams = useSearchParams();

    const seatsParam = searchParams.get('seats');
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const price = searchParams.get('price');
    const plate = searchParams.get('plate');
    const list_id = searchParams.get('list_id');

    const [userId, setUserId] = useState<string | null>(null);
    const [seats, setSeats] = useState<{ seat: number; gender: string }[]>([]);

    useEffect(() => {
        if (localStorage.getItem('rememberMe') === 'true') {
            const storedUserId = localStorage.getItem('userId');
            setUserId(storedUserId);
        } else {
            const storedUserId = sessionStorage.getItem('userId');
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        if (seatsParam) {
            try {
                setSeats(JSON.parse(decodeURIComponent(seatsParam)));
            } catch (err) {
                console.error('Failed to parse seats:', err);
            }
        }
    }, [seatsParam]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            alert('User ID is not available!');
            return;
        }

        const data = {
            user_id: userId,
            list_id,
            plate,
            start_location: origin,
            end_location: destination,
            seat_numbers: seats,
            time,
            date,
        };

        try {
            const response = await fetch('http://localhost:8000/api/set-seats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert('Biletleme işlemi başarılı!');
            } else {
                alert(result.message || 'Bir hata oluştu!');
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('Bir hata oluştu, lütfen tekrar deneyin.');
        }
    };

    const totalPrice = seats.length * Number(price || 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center justify-center py-12 px-4">
            <Navbar /> {/* Navbar'ı en üstte yerleştiriyoruz */}
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 border border-gray-200 animate-fade-in">
                <h1 className="text-4xl font-bold text-center text-green-700 mb-6">🎫 Ticket Summary</h1>

                <div className="space-y-4 text-lg">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🚌</span>
                        <p className="text-gray-700 font-semibold">
                            <span className="text-green-800">{origin}</span> → <span className="text-green-800">{destination}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📅</span>
                        <p className="text-gray-700 font-semibold">{date}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⏰</span>
                        <p className="text-gray-700 font-semibold">{time}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-2xl">💵</span>
                        <div>
                            <p className="text-green-600 text-xl font-bold">{price} ₺ / per seat</p>
                            <p className="text-gray-700 font-semibold">Total: {totalPrice} ₺</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Selected Seats</h2>
                        <div className="flex flex-wrap gap-3">
                            {seats.length > 0 ? (
                                seats.map((s, i) => (
                                    <span
                                        key={i}
                                        className={`px-4 py-2 rounded-full text-white font-semibold shadow ${s.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}
                                    >
                                        Seat {s.seat} - {s.gender}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No seats selected.</p>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full">
                            ONAYLA
                        </button>
                    </form>
                </div>
            </div>
            <Footer /> {/* Footer'ı ekliyoruz */}
        </div>
    );
};

export default TicketPage;
