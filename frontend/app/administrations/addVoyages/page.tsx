"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useState } from "react";
import DatePicker from "react-datepicker";

type CityStop = {
    city: string;
    time: string;
    date: string;
};

const defaultStop: CityStop = {
    city: "Bursa",
    time: "15:30",
    date: "08.05.2025",
};

const VoyageForm = () => {
    const [stops, setStops] = useState<CityStop[]>([{ ...defaultStop }]);
    const [bus_plate, setbus_Plate] = useState("");
    const [crew, setCrew] = useState("");

    const handleInputChange = (index: number, field: keyof CityStop, value: string) => {
        const updated = [...stops];
        updated[index] = { ...updated[index], [field]: value };
        setStops(updated);
    };

    const handleAddStop = () => {
        setStops([...stops, { ...defaultStop }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {

        const companyName= localStorage.getItem('name') ?? sessionStorage.getItem('name');
        const image=localStorage.getItem('profile_picture')??sessionStorage.getItem('profile_picture');


        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/add-voyage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bus_company: companyName,
                    bus_plate,
                    seats_emp: [
                        { "seat_number": "1", "status": "Occupied" }
                    ],
                    seats_full: [
                        { "seat_number": "2", "status": "Available" }
                    ],

                    crew,
                    cities: stops,
                    image
                }),
            });

            const data = await response.json();
            console.log("Voyage created:", data);
            alert(data.message)
        } catch (error) {
            console.error("Error submitting voyage:", error);
            alert(error);
        }
    };

    return (
        <>
            <div className="flex flex-col h-screen">
                <Navbar />
                <form
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-6"
                >
                    <h2 className="text-2xl font-bold text-center">Create New Voyage</h2>

                    <div className="flex flex-row space-x-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">bus_Plate</label>
                            <input
                                type="text"
                                value={bus_plate}
                                onChange={(e) => setbus_Plate(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Crew</label>
                            <input
                                type="text"
                                value={crew}
                                onChange={(e) => setCrew(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>
                    </div>

                    
                    <div className="space-y-4">
                        {stops.map((stop, index) => (
                            <div
                                key={index}
                                className="flex flex-row space-x-2 p-4 rounded-lg bg-gray-50 border"
                            >
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input
                                        type="text"
                                        value={stop.city}
                                        onChange={(e) =>
                                            handleInputChange(index, "city", e.target.value)
                                        }
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Time</label>
                                    <input
                                        type="time"
                                        value={stop.time}
                                        onChange={(e) =>
                                            handleInputChange(index, "time", e.target.value)
                                        }
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={stop.date}
                                        onChange={(e) =>
                                            handleInputChange(index, "date", e.target.value)
                                        }
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
                            className="font-bold text-blue-600 hover:text-blue-800 transition"
                        >
                            + Add Stop
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                            Create Voyage
                        </button>
                    </div>
                </form>
                <div className="mt-auto" />
                <Footer />
            </div>
        </>
    );
};

export default VoyageForm;
