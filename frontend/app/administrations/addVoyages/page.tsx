'use client';
import React, { useState } from 'react';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';

const cities: string[] = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray",
    "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin",
    "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt",
    "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
    "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
    "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum",
    "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
    "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir",
    "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu",
    "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kocaeli",
    "Konya", "Kütahya", "Malatya", "Manisa", "Mardin",
    "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde",
    "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun",
    "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak",
    "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak",
    "Van", "Yalova", "Yozgat", "Zonguldak"
];

const AddVoyagePage = () => {
    const [fromCity, setFromCity] = useState<string>("");
    const [toCity, setToCity] = useState<string>("");
    const [departureDate, setDepartureDate] = useState<string>("");
    const [crew, setCrew] = useState<string>("");  // Default 1 person

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const voyageData = {
            fromCity,
            toCity,
            departureDate,
            crew,
        };

        console.log("Voyage Data:", voyageData);
        // Burada API'ye veri gönderebilirsiniz
    };

    return (
        <>
            <div className='flex flex-col h-screen'>
                <Navbar />
                <div className='mt-9 max-w-sm mx-auto bg-white shadow-md rounded-lg p-6'>
                    <h1 className='text-xl font-semibold text-center'>Create New Voyage</h1>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label htmlFor="fromCity" className="block text-sm font-medium text-gray-700">From City</label>
                            <select
                                id="fromCity"
                                name="fromCity"
                                value={fromCity}
                                onChange={(e) => setFromCity(e.target.value)}
                                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select a city</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="toCity" className="block text-sm font-medium text-gray-700">To City</label>
                            <select
                                id="toCity"
                                name="toCity"
                                value={toCity}
                                onChange={(e) => setToCity(e.target.value)}
                                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select a city</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">Departure Date</label>
                            <input
                                type="date"
                                id="departureDate"
                                name="departureDate"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="crew" className="block text-sm font-medium text-gray-700">Crew Members</label>
                            <input
                                type="text"
                                id="crew"
                                name="crew"
                                value={crew}
                                onChange={(e) => setCrew(e.target.value)}
                                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none"
                            >
                                Create Voyage
                            </button>
                        </div>
                    </form>
                </div>
                <div className='mt-auto'></div>
                <Footer />
            </div>
        </>
    );
};

export default AddVoyagePage;
