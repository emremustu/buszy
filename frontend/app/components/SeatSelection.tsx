'use client';
import { useState } from 'react';

const SeatSelection = () => {
    const [seatGenderMap, setSeatGenderMap] = useState<{ [key: number]: 'male' | 'female' }>({});
    const [pendingSeat, setPendingSeat] = useState<number | null>(null);

    const handleSeatClick = (seat: number) => {
        if (pendingSeat !== null) return; // Kullanıcı cinsiyet seçimi yaparken başka koltuğa basamasın

        if (seatGenderMap[seat]) {
            // Eğer koltuk zaten doluysa tıklayınca boşalt
            setSeatGenderMap((prev) => {
                const updated = { ...prev };
                delete updated[seat];
                return updated;
            });
        } else {
            // Eğer boşsa yeni seçim başlat
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

    const renderSeat = (seat: string | number) => {
        if (seat === '') {
            return <div className="w-10 h-10"></div>;
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

        const colorClass =
            seatGenderMap[seat as number] === 'male'
                ? 'bg-blue-400'
                : seatGenderMap[seat as number] === 'female'
                    ? 'bg-pink-400'
                    : 'bg-gray-200';

        return (
            <button
                onClick={() => handleSeatClick(Number(seat))}
                className={`w-12 h-12 rounded-md border flex items-center justify-center text-xs font-bold ${colorClass}`}
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
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Select Your Seat</h2>

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
        </div>
    );
};

export default SeatSelection;
