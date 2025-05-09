'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SeatSelectionProps {
    voyage: any;
    voyageData: { origin: string | null; destination: string | null; date: string | null };
}

const SeatSelection = ({ voyage, voyageData }: SeatSelectionProps) => {
    const [seatGenderMap, setSeatGenderMap] = useState<{ [key: number]: 'male' | 'female' }>({});
    const [pendingSeat, setPendingSeat] = useState<number | null>(null);
    const [occupiedSeats, setOccupiedSeats] = useState<{ [key: number]: string }>({});
    const [hoveredSeat, setHoveredSeat] = useState<number | null>(null); // State to track hovered seat
    const router = useRouter();

    useEffect(() => {
        const fetchOccupiedSeats = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/get-seats', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        plate: voyage.bus_plate,
                        start_location: voyageData.origin,
                        end_location: voyageData.destination,
                    }),
                });

                const result = await response.json();
                if (result.success) {
                    const occupied: { [key: number]: string } = {};
                    result.seats
                        .filter((seat: any) => seat[4] === 'Occupied')
                        .forEach((seat: any) => {
                            occupied[seat[3]] = seat[5];
                        });
                    setOccupiedSeats(occupied);
                } else {
                    console.log("Failed to fetch seat data");
                }
            } catch (error) {
                console.error("Error fetching seat data:", error);
            }
        };

        if (voyageData.origin && voyageData.destination && voyage.bus_plate) {
            fetchOccupiedSeats();
        }
    }, [voyageData.origin, voyageData.destination, voyage]);

    const handleSeatClick = (seat: number) => {
        if (pendingSeat !== null) return;
        if (seatGenderMap[seat]) {
            setSeatGenderMap((prev) => {
                const updated = { ...prev };
                delete updated[seat];
                return updated;
            });
        } else {
            setPendingSeat(seat);
        }
    };

    const handleGenderSelect = (gender: 'male' | 'female') => {
        if (pendingSeat !== null) {
            setSeatGenderMap((prev) => ({
                ...prev,
                [pendingSeat]: gender,
            }));
            setPendingSeat(null);
        }
    };

    const handleConfirm = () => {
        const selectedSeats = Object.entries(seatGenderMap).map(([seat, gender]) => ({
            seat: Number(seat),
            gender,
        }));

        router.push(`/ticket?seats=${encodeURIComponent(JSON.stringify(selectedSeats))}&origin=${voyageData.origin}&destination=${voyageData.destination}&date=${voyageData.date}&time=${voyage.bus_time}&price=${voyage.bus_list_price}&plate=${voyage.bus_plate}&list_id=${voyage.list_id}`);
    };

    const layout = [
        ['', '', '', '3', '6', '9', '12', '15', '18', '21', '', '25', '28', '31', '34', '37', '41'],
        ['', '', '', '2', '5', '8', '11', '14', '17', '20', '', '24', '27', '30', '33', '36', '40'],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['driver', '', '', '1', '4', '7', '10', '13', '16', '19', '23', '26', '29', '32', '35', '38', '39'],
    ];

    const renderSeat = (seat: string | number) => {
        if (seat === '') return <div className="w-10 h-10" />;
        if (seat === 'driver') {
            return <div className="w-12 h-12 bg-gray-700 flex items-center justify-center text-white rounded-full text-lg">🚍</div>;
        }

        const seatNumber = Number(seat);
        const isOccupied = occupiedSeats.hasOwnProperty(seatNumber);
        const gender = isOccupied ? occupiedSeats[seatNumber] : null;

        const colorClass =
            isOccupied
                ? gender === 'male'
                    ? 'bg-blue-400'
                    : 'bg-pink-400'
                : seatGenderMap[seatNumber] === 'male'
                    ? 'bg-blue-400'
                    : seatGenderMap[seatNumber] === 'female'
                        ? 'bg-pink-400'
                        : 'bg-gray-200';

        // Add hover effect dynamically
        const hoverClass = hoveredSeat === seatNumber ? 'hover:scale-110 hover:bg-opacity-60' : '';

        return (
            <button
                onClick={() => !isOccupied && handleSeatClick(seatNumber)}
                onMouseEnter={() => setHoveredSeat(seatNumber)} // On hover, set hovered seat
                onMouseLeave={() => setHoveredSeat(null)} // Remove hover effect
                className={`w-12 h-12 rounded-md border flex items-center justify-center text-xs font-bold ${colorClass} ${hoverClass}`}
                disabled={isOccupied}
            >
                {seat}
            </button>
        );
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Select Your Seat</h2>
            <div className="bg-gray-100 p-8 rounded-2xl shadow-lg flex flex-col items-center">
                <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: 'repeat(17, minmax(30px, 1fr))', gridAutoRows: 'minmax(30px, 1fr)' }}
                >
                    {layout.flat().map((seat, index) => (
                        <div key={index} className="flex items-center justify-center">
                            {renderSeat(seat)}
                        </div>
                    ))}
                </div>
            </div>

            {pendingSeat !== null && (
                <div className="mt-4 flex gap-4">
                    <button
                        onClick={() => handleGenderSelect('male')}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Male
                    </button>
                    <button
                        onClick={() => handleGenderSelect('female')}
                        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Female
                    </button>
                </div>
            )}

            {Object.keys(seatGenderMap).length > 0 && (
                <button
                    onClick={handleConfirm}
                    className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full"
                >
                    Confirm
                </button>
            )}
        </div>
    );
};

export default SeatSelection;
