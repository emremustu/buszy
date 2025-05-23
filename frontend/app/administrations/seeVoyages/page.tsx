'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CardComponent = () => {
    const [bus_plate, setBus_plate] = useState('');
    const [responseMessage, setResponseMessage] = useState<string>(''); // API'dan gelen mesajı tutacak state
    const [voyageData, setVoyageData] = useState<any>(null); // Voyage verilerini tutacak state

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
            
            console.log("API Cevabı:", result); // API cevabını konsola yazdır

            if (result.success) {
                setResponseMessage("Voyage found!");
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

    // voyageData'yı kontrol et
    useEffect(() => {
        console.log("Voyage Data:", voyageData); // voyageData'nın verisini kontrol et
    }, [voyageData]); // voyageData değiştiğinde çalışacak

    // 
    const formatCities = (cityData: string) => {
        try {
            const cities = JSON.parse(cityData); // Parse the string into an array
            return cities.map((city: any) => `${city.city} - ${city.date} - ${city.time}`).join(', ');
        } catch (error) {
            console.error("Error parsing cities:", error);
            return "No cities data available";
        }
    };

    return (
        <>
            <div className='flex flex-col h-screen'>
                <Navbar/>
                <div className="mt-16 max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                    <h1 className='mt-7 text-center font-sans'>See Voyages</h1>
                    <div className="p-4">
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-row space-x-10'>
                                <input
                                    type="text"
                                    value={bus_plate}
                                    onChange={(e) => setBus_plate(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Plate Number"
                                />
                            </div>
                            <button type='submit' className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none">
                                Search
                            </button>
                        </form>
                    </div>

                    {/* API'dan gelen mesaj veya voyage verisini kart olarak göster */}
                    {responseMessage && (
                        <div className="mt-5 p-4 border rounded-md bg-gray-100">
                            <h2 className="text-lg font-semibold">{responseMessage}</h2>
                            {/* Eğer voyage verisi varsa, onu da kart içinde göster */}
                            {voyageData && (
                                <div className="mt-4">
                                    <p><strong>Bus ID:</strong> {voyageData[0]}</p>
                                    <p><strong>Bus Plate:</strong> {voyageData[2]}</p>
                                    <p><strong>Crew:</strong> {voyageData[3]}</p>
                                    <p><strong>Cities:</strong> {formatCities(voyageData[4])}</p> 
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className='mt-auto'></div>
                <Footer />
            </div>
        </>
    );
};

export default CardComponent;
