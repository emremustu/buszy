'use client';
import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react'

const reportPage = () => {
    const [bus_plate, setBus_plate] = useState('');
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [inputVisible, setInputVisible] = useState<{ [key: string]: boolean }>({});
    const [updatedData, setUpdatedData] = useState<any>({}); // Hold the updated data for crew and cities
    const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});
    const [voyageData, setVoyageData] = useState<string[][]>([]);
    const [rowMessages, setRowMessages] = useState<{ [key: number]: string }>({});





    const handleEditToggle = (index: number) => {
        setIsEditing(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = { plate: bus_plate };

        try {
            const response = await fetch('http://localhost:8000/api/get_voyage_listing_by_plate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {

                setResponseMessage("Voyage:");
                setVoyageData(result.voyage_list);
            } else {
                setResponseMessage(result.message || "An error occurred!");
                setVoyageData([]);
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            setResponseMessage("An error occurred, please try again.");
            setVoyageData([]);
        }
        console.log(voyageData);
    };

    const handleInputVisibility = (key: string) => {
        setInputVisible(prevState => ({
            ...prevState,
            [key]: !prevState[key], // Toggle visibility of the input
        }));
    };

    const handleUpdate = async (field: string, value: string | string[], index?: number) => {
        const data = {
            list_id: value[0],
            bus_time: value[2],
            bus_list_begin: value[3],
            bus_list_end: value[4],
            price: value[5],
            date: value[6],
        };

        try {
            const response = await fetch('http://localhost:8000/api/update-voyage-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                setResponseMessage(`Successfully updated ${field}`);

                // 👇 Edit modunu kapat
                if (typeof index === 'number') {
                    setIsEditing((prev) => ({
                        ...prev,
                        [index]: false,
                    }));
                    // Satıra özel mesajı göster
                    setRowMessages((prev) => ({
                        ...prev,
                        [index]: 'Successfully updated',
                    }));

                    // 3 saniye sonra sil
                    setTimeout(() => {
                        setRowMessages((prev) => {
                            const updated = { ...prev };
                            delete updated[index];
                            return updated;
                        });
                    }, 3000);
                }

            } else {
                setResponseMessage(`Failed to update ${field}: ${result.message}`);
            }
        } catch (error) {
            console.error("Error during update:", error);
            setResponseMessage("Error during update, please try again.");
        }
    };

    return (
        <>
            <div className='flex flex-col h-screen '>
                <Navbar />
                <div className='flex flex-col items-center mt-5'>
                    <div className="w-full space-y-4 max-w-md p-6 bg-white rounded-lg shadow-lg">
                        <p className="flex items-center gap-2">
                            <p>Change Voyage Information</p>
                            <ArrowsRightLeftIcon className="w-4 h-4 text-black"></ArrowsRightLeftIcon>
                            
                        </p>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={bus_plate}
                                onChange={(e) => setBus_plate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Plate Number"
                            />
                            <button type='submit' className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none">
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                <div className='flex flex-col justify-center items-center my-20'>
                    {voyageData.map((voyage: string[], index: number) => (
                        <div key={index} className='flex flex-col items-center justify-center mt-10'>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className='flex flex-col bg-gray-50 items-center p-4 rounded shadow'>
                                    <div className='flex flex-row justify-center items-center flex-wrap'>
                                        {voyage.map((field: string, fieldIndex: number) => (
                                            <input
                                                key={fieldIndex}
                                                type="text"
                                                className='m-2 p-2 border border-gray-300 rounded'
                                                value={field}
                                                disabled={!isEditing[index] || fieldIndex === 0 || fieldIndex === 1 || fieldIndex === 7}

                                                onChange={(e) => {
                                                    const newData = [...voyageData];
                                                    newData[index][fieldIndex] = e.target.value;
                                                    setVoyageData(newData);
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            type='button'
                                            className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600'
                                            onClick={() => handleEditToggle(index)}
                                        >
                                            {isEditing[index] ? 'Cancel' : 'Edit'}
                                        </button>
                                        {isEditing[index] && (
                                            <button
                                                type='button'
                                                className='bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600'
                                                onClick={() => handleUpdate('voyage_row', voyage, index)}
                                            >
                                                Save
                                            </button>


                                        )}
                                    </div>
                                    {rowMessages[index] && (
                                        <p className="text-green-600 text-sm mt-2">{rowMessages[index]}</p>
                                    )}
                                </div>
                            </form>
                        </div>
                    ))}


                </div>
                <div className='mt-auto'></div>
                <Footer />
            </div>
        </>
    );
};

export default reportPage;
