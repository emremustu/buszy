'use client';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { ClockIcon, TicketIcon, TrashIcon, UserIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

const TicketPage = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [date, setDate] = useState('');

  const handleDelete = (id: number) => {
    console.log("Silinecek bilet ID:", id);    
  };
  

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const companyName = localStorage.getItem('name') ?? sessionStorage.getItem('name');

    if (!companyName) {
      setResponseMessage("Company information is not found.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/get-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company: companyName,
          origin,
          destination,
          date,
        }),
      });

      const result = await response.json();
      console.log("API cevabı:", result);

      if (result.status === "success" && Array.isArray(result.tickets)) {
        setTickets(result.tickets);
       
      } else {
        setResponseMessage(`No ticket found in ${companyName} turizm!`);
        setTickets([]);
      }
    } catch (error) {
      console.error("Fetch hatası:", error);
      setResponseMessage("Bir hata oluştu, lütfen tekrar deneyin.");
      setTickets([]);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <form onSubmit={handleSearch} className="mt-10 mx-4 space-x-20 flex justify-between">
        <div className="w-1/3">
          <label className="block text-lg">From</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
            placeholder="Enter origin"
            required
          />
        </div>

        <div className="w-1/3">
          <label className="block text-lg">To</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
            placeholder="Enter destination"
            required
          />
        </div>

        <div className="w-1/3">
          <label className="block text-lg">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
      </form>
      <div className="text-center mt-6">
        <button
          type="submit"
          onClick={handleSearch}
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          <div className="flex items-center gap-2">
            Search Tickets
            <span className="p-1 border border-white rounded-full flex items-center justify-center">
              <TicketIcon className="w-4 h-4 text-white" />
            </span>
          </div>
        </button>
      </div>
      <div className="text-center mt-4">
        <p className="text-lg text-gray-700">{responseMessage}</p>
      </div>

      {tickets.length > 0 && (
        <div className='ml-10 flex flex-row space-x-8'>
          {tickets.map((ticket: any, index: number) => (
            <div key={index} className="mb-4 p-4 w-fit border rounded bg-emerald-50 shadow-sm">
              <div className='flex flex-row space-x-3'>
                <p className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <span>{ticket[5]}</span>
                </p>
                <p className="flex items-center">
                  <TrashIcon
                    className="w-5 h-5 text-red-500 hover:text-red-800 cursor-pointer"
                    onClick={() => handleDelete(ticket[0])}
                  />
                </p>

              </div>
              <p className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <span>{ticket[6]}</span>
              </p>

            </div>
          ))}
        </div>
      )}

      <div className="mt-auto" />
      <Footer />
    </div>
  );
};

export default TicketPage;
