'use client';

import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useState } from "react";

const TripsPage = () => {
  const [date, setDate] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [voyages, setVoyages] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      date,
      origin,
      destination,
    };

    try {
      const response = await fetch('http://localhost:8000/api/get-voyage-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setVoyages(result.voyages); // Set the voyages in state
      } else {
        console.log("Error fetching voyages");
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div className="mx-48">
        {/* Main Content */}
        <h1 className="trip-title text-2xl font-bold text-gray-800 mb-6">
          Trips for <strong>{origin} - {destination}</strong>
        </h1>

        {/* Filters Bar */}
        <form onSubmit={handleSubmit}>
          <div className='flex flex-row space-x-10'>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Origin"
            />
          </div>
          <div className='flex flex-row space-x-10'>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Destination"
            />
          </div>
          <div className='flex flex-row space-x-10'>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button type='submit' className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none">
            Search
          </button>
        </form>

        {/* Bus Cards */}
        {voyages.length > 0 ? (
          voyages.map((voyage, index) => (
            <section key={index} className="bus-card bg-white flex items-center justify-between p-6 mb-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
              <Image src="/images/kamilkoc.png" alt="Bus Company Logo" width={100} height={50} />
              <div className="bus-info flex-1 ml-8">
                <div className="seat-info flex items-center justify-center gap-2 mb-1">
                  <Image src="/images/seat-icon.png" alt="Seat Icon" width={50} height={50} />
                  <span className="text-lg">2+1</span>
                </div>

                <div className="time-price flex justify-between items-center gap-8">
                  <div className="time-block">
                    <h2 className="text-3xl text-gray-800">{voyage[2]}</h2> {/* Departure time */}
                    <p className="text-sm text-gray-500">7 and half hours</p>
                  </div>
                </div>

                <p className="route text-xl font-semibold text-green-900 text-center mt-3 tracking-wide capitalize">
                  {voyage[3]} - {voyage[4]} {/* Origin and Destination */}
                </p>
              </div>

              <div className="price-container flex flex-col items-center justify-center gap-4 mt-5">
                <button className="seat-btn bg-primary text-white py-3 px-6 rounded-full font-bold hover:bg-primarybr hover:scale-105 transition-transform duration-300">
                  Take a Seat
                </button>
                <div className="price text-3xl font-bold text-green-500">
                  <strong>{voyage[5]} ₺</strong> {/* Price */}
                </div>
              </div>
            </section>
          ))
        ) : (
          <p>No voyages available for the selected criteria.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default TripsPage;
