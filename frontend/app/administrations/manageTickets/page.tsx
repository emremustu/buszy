'use client';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { useState } from 'react';


const TicketPage = () => {
    const[origin,setOrigin]= useState('');
    const[destination,setDestination]= useState('');
    const [responseMessage, setResponseMessage] = useState<string>(''); 
    const [voyageData, setVoyageData] = useState<any>(null);
    const[company,setCompany]= useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Formun sayfa yenilenmesini engelle
    const data={
        origin:origin,
        destination:destination,
        company:company
    };

    try{
        const response= await fetch ('http://localhost:8000/api/get-tickets',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("API Cevabi:", result); // API cevabını konsola yazdır
        
        if (result.success) {
            setResponseMessage("Voyage found!");
            setVoyageData(result.voyage); // Gelen voyage verisini state'e kaydet
        } else {
            setResponseMessage(result.message || "Bir hata oluştu!"); // Hata mesajı
            setVoyageData(null); // Eğer hata varsa voyageData'yı sıfırla
        }
    }
    catch (error) {
        console.error("Error during fetch:", error);
        setResponseMessage("Bir hata oluştu, lütfen tekrar deneyin.");
        setVoyageData(null);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar />

        {/* Seçim Alanları */}
        <div className="mt-10 mx-4 flex justify-between">
          <div className="w-1/3">
            <label htmlFor="from" className="block text-lg">From</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
              placeholder="Enter origin"
            />
          </div>
          <div className="w-1/3">
            <label htmlFor="to" className="block text-lg">To</label>
            <input
             
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
              placeholder="Enter destination"
            />
          </div>
          {/*<div className="w-1/3">
            <label htmlFor="date" className="block text-lg">Date</label>
            <input
              
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>*/}
        </div>

        {/* Arama Butonu */}
        <div className="text-center mt-6">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          >
            Search Tickets
          </button>
        </div>
        
        <div className="mt-auto" />
        <Footer />
      </div>
    </>
  );
};

export default TicketPage;
