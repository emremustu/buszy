"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Voyage = [number, string, string, string, string, string, string, string];

const TripsPage = () => {
  const [voyages, setVoyages] = useState<Voyage[]>([]);

  const [origin, setOrigin] = useState("Isparta");
  const [destination, setDestination] = useState("Kayseri");
  const [date, setDate] = useState("2025-04-21");

  const [seatFilter, setSeatFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  const fetchVoyages = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/get-voyage-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ origin, destination, date }),
      });

      const data = await response.json();
      if (data.success) {
        setVoyages(data.voyages);
      }
    } catch (error) {
      console.error("Error fetching voyages:", error);
    }
  };

  const applyFilters = () => {
    fetchVoyages();
  };

  useEffect(() => {
    fetchVoyages();
  }, []);

  return (
    <>
      <Navbar />
      <div className="mx-48">
        {/* Input alanları */}
        <div className="filter-form mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Origin"
              className="border p-2 rounded w-1/3"
            />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              className="border p-2 rounded w-1/3"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded w-1/3"
            />
          </div>
        </div>

        {/* Başlık */}
        <h1 className="trip-title text-2xl font-bold text-gray-800 mb-6">
          Trips for <strong>{origin} - {destination}</strong>
        </h1>

        {/* Filtre Barı */}
        <div className="filters-bar flex justify-between items-center mb-6 p-6 bg-white rounded-xl shadow-lg">
          <button
            onClick={applyFilters}
            className="filter-button bg-primary text-white py-2 px-6 rounded-full font-bold text-sm hover:bg-primarybr transition-transform duration-300"
          >
            Filters &gt;
          </button>
          <div className="tags flex gap-3 flex-wrap">
            <span
              onClick={() => setSeatFilter("2+1")}
              className={`tag cursor-pointer py-2 px-6 rounded-full text-sm ${
                seatFilter === "2+1" ? "bg-primary text-white" : "bg-gray-300 text-gray-800"
              } hover:bg-primary hover:text-white transition-colors duration-300`}
            >
              2+1
            </span>
            <span
              onClick={() => setTimeFilter("12:00-14:00")}
              className={`tag cursor-pointer py-2 px-6 rounded-full text-sm ${
                timeFilter === "12:00-14:00" ? "bg-primary text-white" : "bg-gray-300 text-gray-800"
              } hover:bg-primary hover:text-white transition-colors duration-300`}
            >
              12:00 - 14:00
            </span>
          </div>
        </div>

        {/* Sefer Kartları */}
        {voyages.map((voyage, index) => {
          const departureHour = voyage[2]?.slice(0, 5);

          // Filtre kontrolü (saat)
          if (timeFilter === "12:00-14:00") {
            const [hour, minute] = departureHour.split(":").map(Number);
            const totalMinutes = hour * 60 + minute;
            if (totalMinutes < 720 || totalMinutes > 840) return null;
          }

          return (
            <section
              key={index}
              className="bus-card bg-white flex items-center justify-between p-6 mb-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              <Image src="/images/kamilkoc.png" alt="Bus Company Logo" width={100} height={50} />
              <div className="bus-info flex-1 ml-8">
                <div className="seat-info flex items-center justify-center gap-2 mb-1">
                  <Image src="/images/seat-icon.png" alt="Seat Icon" width={50} height={50} />
                  <span className="text-lg">2+1</span>
                </div>

                <div className="time-price flex justify-between items-center gap-8">
                  <div className="time-block">
                    <h2 className="text-3xl text-gray-800">
                      {typeof voyage[2] === "string" ? voyage[2].slice(0, 5) : "Bilinmiyor"}
                    </h2>
                    <p className="text-sm text-gray-500">Süre bilgisi eksik</p>
                  </div>
                </div>

                <p className="route text-xl font-semibold text-green-900 text-center mt-3 tracking-wide capitalize">
                  {voyage[3]} - {voyage[4]}
                </p>
              </div>

              <div className="price-container flex flex-col items-center justify-center gap-4 mt-5">
                <button className="seat-btn bg-primary text-white py-3 px-6 rounded-full font-bold hover:bg-primarybr hover:scale-105 transition-transform duration-300">
                  Take a Seat
                </button>
                <div className="price text-3xl font-bold text-green-500">
                  <strong>{parseFloat(voyage[5]).toFixed(0)} ₺</strong>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <Footer />
    </>
  );
};

export default TripsPage;

