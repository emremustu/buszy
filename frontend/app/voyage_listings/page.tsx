'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SeatSelection from "../components/SeatSelection"; // yeni SeatSelection bileşeni

const TripsPage = () => {
  const searchParams = useSearchParams();
  const [voyages, setVoyages] = useState<any[]>([]);
  const [expandedVoyageIndex, setExpandedVoyageIndex] = useState<number | null>(null);

  const origin = searchParams?.get('origin');
  const destination = searchParams?.get('destination');
  const date = searchParams?.get('date');

  const [voyageData, setVoyageData] = useState({
    origin: origin,
    destination: destination,
    date: date
  });

  useEffect(() => {
    if (origin && destination && date) {
      const data = { origin, destination, date };

      const fetchVoyages = async () => {
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
            setVoyages(result.voyages);
          } else {
            setVoyages([]);
            console.log("Error fetching voyages");
          }
        } catch (error) {
          setVoyages([]);
          console.log("An error occurred:", error);
        }
      };

      fetchVoyages();
    }
  }, [origin, destination, date]);

  const handleTakeSeat = (index: number) => {
    setExpandedVoyageIndex(prev => (prev === index ? null : index));
  };

  return (
    <>
      <Navbar />

      <div className="mx-48 flex flex-col min-h-screen">
        <h1 className="trip-title text-2xl font-bold text-gray-800 mb-6 mt-6">
          Trips for <strong>{voyageData?.origin} - {voyageData?.destination}</strong>
        </h1>

        {voyages && voyages.length > 0 ? (
          voyages.map((voyage, index) => (
            <div key={index} className="mb-10">
              <section className="bus-card bg-white flex items-center justify-between p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">

                {/* Otobüs logosu */}
                <div className="bus-logo w-20 h-12">
                  {voyage.image && voyage.image !== "null" ? (
                    <img
                      src={`data:image/png;base64,${voyage.image}`}
                      alt={voyage.bus_company}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src="/assets/images/default_bus_logo.png"
                      alt="Default Bus Logo"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <div className="bus-info flex-1 ml-8">
                  <div className="seat-info flex items-center justify-center gap-2 mb-1">
                    <Image src="/assets/images/seat-icon.png" alt="Seat Icon" width={50} height={50} />
                    <span className="text-lg">2+1</span>
                  </div>

                  <div className="time-price flex justify-between items-center gap-8">
                    <div className="time-block">
                      <h2 className="text-3xl text-gray-800">{voyage.bus_time}</h2>
                    </div>
                  </div>

                  <p className="route text-xl font-semibold text-green-900 text-center mt-3 tracking-wide capitalize">
                    {voyage.bus_list_begin} - {voyage.bus_list_end}
                  </p>
                </div>

                <div className="price-container flex flex-col items-center justify-center gap-4 mt-5">
                  <button
                    onClick={() => handleTakeSeat(index)}
                    className="seat-btn bg-primary text-white py-3 px-6 rounded-full font-bold hover:bg-primarybr hover:scale-105 transition-transform duration-300"
                  >
                    Take a Seat
                  </button>
                  <div className="price text-3xl font-bold text-green-500">
                    <strong>{voyage.bus_list_price} ₺</strong>
                  </div>
                </div>
              </section>

              {expandedVoyageIndex === index && (
                <div className="mt-6">
                  <SeatSelection voyage={voyage} voyageData={voyageData} />
                </div>
              )}
            </div>
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
