import React from 'react'
import Footer from '../components/Footer'
import Link from 'next/link'
import Navbar from '../components/Navbar'

const AdminPage = () => {
    return (
        <>
            <div className="flex flex-col min-h-screen ">
                <Navbar />

                <main className="flex flex-1 items-center justify-center p-4 ">
                    <div className="w-full max-w-4xl grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        <Link href="/administrations/seeVoyages" className="bg-primarybr text-white py-3 px-6 rounded-3xl hover:bg-green-600 text-center">
                            See Voyages
                        </Link>

                        <Link href="/administrations/addVoyages" className="bg-primarybr text-white py-3 px-6 rounded-3xl hover:bg-green-600 text-center">
                            Add a Voyage
                        </Link>

                        <Link href="/administrations/changeVoyageInformation" className="bg-primarybr text-white py-3 px-6 rounded-3xl hover:bg-green-600 text-center">
                            Change Voyage Information
                        </Link>

                        <button className="bg-primarybr text-white py-3 px-6 rounded-3xl hover:bg-green-600 text-center">
                            Customer Comments
                        </button>

                        <button className="bg-primarybr text-white py-3 px-6 rounded-3xl hover:bg-green-600 text-center">
                            Manage Tickets
                        </button>

                        <button className="bg-primarybr text-white py-3 px-6 rounded-3xl border-4 hover:bg-green-600 text-center">
                            Help Desk
                        </button>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    )
}

export default AdminPage
