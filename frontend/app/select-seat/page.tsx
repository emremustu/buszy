'use client';
import { useState } from 'react';

const SeatSelectionPage = () => {
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

    const handleSeatClick = (seat: number) => {
        setSelectedSeat(seat);
    };

    const renderSeat = (seat: string | number) => {
        if (seat === '') {
            return <div className="w-10 h-10"></div>; // boşluk
        }
        if (seat === 'driver') {
            return (
                <div className="w-12 h-12 bg-gray-700 flex items-center justify-center text-white rounded-full text-lg">
                    🚍
                </div>
            );
        }
        if (seat === 'door') {
            return (
                <div className="w-12 h-12 border-2 border-dashed border-gray-500 flex items-center justify-center rounded-md text-xs">
                    Door
                </div>
            );
        }
        return (
            <button
                onClick={() => handleSeatClick(Number(seat))}
                className={`w-12 h-12 rounded-md border flex items-center justify-center text-xs font-bold ${selectedSeat === Number(seat) ? 'bg-green-400' : 'bg-gray-200'
                    }`}
            >
                {seat}
            </button>
        );
    };

    const layout = [
        ['', '', '', '3', '6', '9', '12', '15', '18', '21', '', '25', '28', '31', '34', '37', '41'],
        ['', '', '', '2', '5', '8', '11', '14', '17', '20', '', '24', '27', '30', '33', '36', '40',],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',],

        ['driver', '', '', '1', '4', '7', '10', '13', '16', '19', '23', '26', '29', '32', '35', '38', '39'],
    ];


    return (
        <div className="flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-8">Select Your Seat</h1>

            <div className="bg-gray-100 p-8 rounded-2xl shadow-lg flex flex-col items-center">
                <div
                    className="grid gap-4"
                    style={{
                        gridTemplateColumns: 'repeat(17, minmax(30px, 1fr))',
                        gridAutoRows: 'minmax(30px, 1fr)',
                    }}
                >
                    {layout.flat().map((seat, index) => (
                        <div key={index} className="flex items-center justify-center">
                            {renderSeat(seat)}
                        </div>
                    ))}
                </div>
            </div>

            {selectedSeat && (
                <div className="mt-6 text-center">
                    <p className="text-xl font-semibold mb-2">Selected Seat: {selectedSeat}</p>
                    <button className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded-full">
                        Confirm Seat
                    </button>
                </div>
            )}
        </div>
    );
};

export default SeatSelectionPage;






