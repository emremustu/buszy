'use client';
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CardComponent = () => {
    const [inputText, setInputText] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };
    const [bus_id, setBus_id] = useState('');
    const [bus_plate, setBus_plate] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();// Formun sayfa yenilenmesini engelle
        const bus_id_int=parseInt(bus_id);
        const data={
            bus_id_int,
            bus_plate,
        }
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
            alert("Kayıt başarılı!");
          } else {
            alert(result.message || "Bir hata oluştu!"); // Hata mesajını burada göster
          }
        } catch (error) {
          console.error("Error during fetch:", error);
          alert("Bir hata oluştu, lütfen tekrar deneyin.");
        }
      };
    

    return (
        <>
            <div className='flex flex-col h-screen'>
                <Navbar></Navbar>
                <div className="mt-16 max-w-sm mx-auto  bg-white shadow-md rounded-lg overflow-hidden">
                    <h1 className='mt-7 text-center font-sans'>See Voyages</h1>
                    <div className="p-4">
                        <form onSubmit={handleSubmit} action="">
                            <div className='flex flex-row space-x-10'>
                                <input
                                    type="text"
                                    value={bus_plate}
                                    onChange={(e) => setBus_plate(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Plate Number"
                                />
                                <h1> OR </h1>
                                <input
                                    type="number"
                                    value={bus_id}
                                    onChange={(e) => setBus_id(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Bus ID"
                                />
                            </div>
                            <button type='submit' className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
                <div className='mt-auto'></div>
                <Footer></Footer>
            </div>

        </>

    );
};

export default CardComponent;
