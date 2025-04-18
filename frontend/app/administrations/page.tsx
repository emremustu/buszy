import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'

const adminPage = () => {
    return (
        <>
            <div className='flex flex-col h-screen'>
                <Navbar></Navbar>
                <div className='flex flex-col items-center justify-center h-full'>
                    {/*ekrani full olarak aliyor ve footbar-navbari o sekilde ayarliyor h-full*/}
                    <div className="flex flex-wrap space-x-4 p-4">
                        {/* See Voyages Button */}

                        <div className='flex flex-col space-y-5 '>
                            <Link href='/seeVoyages' className="bg-primarybr text-white py-2 px-4 rounded-3xl hover:bg-green-600 w-124 flex items-center justify-center ">
                                See Voyages
                            </Link>
                            <div className='flex flex-row space-x-10 space-y-4 ' >
                                {/* Add a Voyage Button */}
                                <Link href='/' className="bg-primarybr text-white py-2 px-4 rounded-3xl hover:bg-green-600 h-14 w-57 flex items-center justify-center">
                                    Add a Voyage
                                </Link>

                                {/* Change Voyage Information Button */}
                                <button className="bg-primarybr text-white py-2 px-4 rounded-3xl hover:bg-green-600 h-14 space-x-15">
                                    Change Voyage Information
                                </button>
                                <button className='bg-primarybr text-white py-2 px-4 rounded-3xl hover:bg-green-600 h-14 w-57'>
                                    Customer Comments
                                </button>
                            </div>
                            <div className='flex flex-row space-x-10'>
                                {/* Report a Delay Button */}
                                <button className="bg-primarybr text-white py-2 px-4 rounded-3xl hover:bg-green-600 h-14 w-57">
                                    Report a Delay
                                </button>

                                {/* Manage Tickets Button */}
                                <button className="bg-primarybr text-white py-2 px-4 rounded-3xl hover:bg-green-600 h-14 w-57">
                                    Manage Tickets
                                </button>
                                <button className='bg-primarybr text-white  hover:bg-green-600 py-2 px-4 rounded-3xl h-14 w-57 border-4 border-red-600'>
                                    Help Desk
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-auto'></div>

                <div className='flex flex-col items-center justify-end ml-auto space-y-5'>


                </div>
                <Footer></Footer>
            </div>





        </>
    )
}

export default adminPage