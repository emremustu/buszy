'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CardComponent = () => {
    const [inputText, setInputText] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const handleSubmit = () => {
        // Bu kısımda inputText ile SQL sorgusu yapılabilir.
        console.log("Plate Number:", inputText);
        // SQL sorgusu yapılacak kod buraya gelecek
    };

    return (
        <>
            <div className='flex flex-col h-screen'>
                <Navbar></Navbar>
                <div className="mt-16 max-w-sm mx-auto  bg-white shadow-md rounded-lg overflow-hidden">
                <h1 className='mt-7 text-center font-sans'>See Voyages</h1>
                    <div className="p-4">
                        <div className='flex flex-row space-x-10'>
                        <input
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Plate Number"
                        />
                        <h1> OR </h1>
                        <input
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Bus ID"
                        />
                        </div>
                        
                        <button onClick={handleSubmit} className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none">
                            Search
                        </button>
                    </div>
                </div>
                <div className='mt-auto'></div>
                <Footer></Footer>
            </div>

        </>

    );
};

export default CardComponent;
