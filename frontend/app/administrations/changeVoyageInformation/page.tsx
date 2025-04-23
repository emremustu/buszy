'use client';
import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import React, { useState } from 'react'

const reportPage = () => {
    const [bus_plate, setBus_plate] = useState('');
    const [responseMessage, setResponseMessage] = useState<string>(''); // API'dan gelen mesajı tutacak state
    const [voyageData, setVoyageData] = useState<any>(null); // Voyage verilerini tutacak state
    const [inputVisible, setInputVisible] = useState<{ [key: string]: boolean }>({});
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Formun sayfa yenilenmesini engelle

        const data = {
            bus_plate: bus_plate,
        };

        // POST isteği gönderme
        try {
            const response = await fetch('http://localhost:8000/api/get-voyage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                setResponseMessage("Voyage:");
                setVoyageData(result.voyage); // Gelen voyage verisini state'e kaydet
            } else {
                setResponseMessage(result.message || "Bir hata oluştu!"); // Hata mesajı
                setVoyageData(null); // Eğer hata varsa voyageData'yı sıfırla
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            setResponseMessage("Bir hata oluştu, lütfen tekrar deneyin.");
            setVoyageData(null);
        }
    };
    const extractCities = (data: string) => {
        try {
            const parsedData = JSON.parse(data); // JSON verisini parse et
            return parsedData.map((item: { city: string }) => item.city); // Sadece city'leri al
        } catch (error) {
            console.error("Error parsing JSON data:", error);
            return [];
        }
    };

    const handleInputVisibility = (key: string) => {
        setInputVisible(prevState => ({
            ...prevState,
            [key]: !prevState[key], // Butona tıklanınca input alanını görünür yap veya gizle
        }));
    };
    return (
        <>
            <div className='flex flex-col h-screen '>
                <Navbar></Navbar>
                <div className='flex flex-col items-center mt-5'>
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={bus_plate}
                                onChange={(e) => setBus_plate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Plate Number"
                            />
                            <button type='submit' className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
                <div className='flex flex-row justify-center items-center'>
                {responseMessage && (
                    <div className='flex flex-col items-center justify-center'>
                        <div className="mt-5 p-4 border rounded-md bg-gray-100">
                            <h2 className="text-lg font-semibold">{responseMessage}</h2>
                            {voyageData && (
                                <div className="mt-4">
                                    <p><strong>Bus Plate:</strong> {voyageData[2]}</p>
                                    <div className='flex flex-row items-center space-x-5'>
                                    <p><strong>Crew:</strong> {voyageData[5]}</p>
                                    <button
                                            type='button'
                                            onClick={() => handleInputVisibility('crew')}
                                            className='ml-4 bg-black text-white w-8 h-8 flex items-center justify-center rounded-full'>
                                            +
                                        </button>
                                        </div>
                                    <div className='flex flex-row items-center space-x-5'>
                                        <p><strong>Cities:</strong> { }</p>
                                        <button
                                            type='button'
                                            onClick={() => handleInputVisibility('cities')}
                                            className='ml-4 bg-black text-white w-8 h-8 flex items-center justify-center rounded-full'>
                                            +
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {inputVisible.cities && (
                    <input
                        type="text"
                        className="ml-4 p-2 border border-gray-300 rounded-md"
                        placeholder="Update Details"
                    />
                )}
</div>
                <div className='mt-auto'></div>
                <Footer></Footer>
            </div>
        </>
    )
}

export default reportPage