'use client';
import React, { useEffect } from 'react'
import Footer from '../components/Footer'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation';



const AdminPage = () => {
    const router = useRouter();
    const companyName = localStorage.getItem('name') ?? sessionStorage.getItem('name');

    useEffect(() => { 
        

        const accountType = localStorage.getItem('account_type') ?? sessionStorage.getItem('account_type');
        

        console.log(accountType);
        if (accountType !== 'companies') {
            router.replace('/');
        }
    });

    return (
        <>
            <div className="flex flex-col min-h-screen ">
                <Navbar />
                <main className="flex flex-1 items-center justify-center p-4 ">
                    <div className=" p-10 bg-white shadow-md rounded-lg space-y-6">
                        <h2 className="text-2xl font-bold text-center">Welcome <span className="text-blue-500">{companyName}</span> !</h2>
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

                            <Link href='/administrations/getComments' className="bg-primarybr text-white py-3 px-6 rounded-3xl hover:bg-green-600 text-center">
                                Customer Comments
                            </Link>

                            <Link href="/administrations/manageTickets" className="bg-primarybr text-white py-3 px-6 rounded-3xl hover:bg-green-600 text-center">
                                Manage Tickets
                            </Link>

                            

                        </div>
                    </div>
                </main >

                <Footer />
            </div >
        </>
    )
}

export default AdminPage
