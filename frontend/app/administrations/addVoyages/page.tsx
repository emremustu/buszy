"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useState } from "react";

type CityStop = {
    city: string;
    time: string;
    date: string;
};

const defaultStop: CityStop = {
    city: "Bursa",
    time: "15:30",
    date: "2025-04-21",
};

const VoyageForm = () => {
    const [stops, setStops] = useState<CityStop[]>([defaultStop]);
    const [plate, setPlate] = useState("");
    const [crew, setCrew] = useState("");

    const handleInputChange = (index: number, field: keyof CityStop, value: string) => {
        const updated = [...stops];
        updated[index][field] = value;
        setStops(updated);
    };

    const handleAddStop = () => {
        setStops([...stops, defaultStop]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/create-voyage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cities: stops }),
            });

            const data = await response.json();
            console.log("Voyage created:", data);
        } catch (error) {
            console.error("Error submitting voyage:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col h-screen">
                <Navbar></Navbar>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
                    <h2 className="text-2xl font-bold text-center">Create New Voyage</h2>
                    <div className="flex flex-col space-y-3 ">
                        <div className="flex flex-row space-x-10">
                        <div>
                            <label className="block text-sm font-medium mb-1">Plate</label>
                            <input
                                type="text"
                                value={plate}
                                onChange={(e) => setPlate(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Crew</label>
                            <input
                                type="text"
                                value={crew}
                                onChange={(e) => setCrew(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>
                        </div>
                        {stops.map((stop, index) => (
                            <div key={index} className="flex flex-row border space-x-2 p-4 rounded-lg space-y-4 bg-gray-50">
                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input
                                        type="text"
                                        value={stop.city}
                                        onChange={(e) => handleInputChange(index, "city", e.target.value)}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Time</label>
                                    <input
                                        type="time"
                                        value={stop.time}
                                        onChange={(e) => handleInputChange(index, "time", e.target.value)}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={stop.date}
                                        onChange={(e) => handleInputChange(index, "date", e.target.value)}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                            </div>

                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleAddStop}
                            className=" font-bold text-black hover:text-primarybr transition-transform"
                        >
                            +  Add Stop
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                            Create Voyage
                        </button>
                    </div>
                </form>
                <div className="mt-auto"></div>
                <Footer></Footer>
            </div>
        </>

    );
};

export default VoyageForm;
