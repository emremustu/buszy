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
            <Link href='/'  className="cursor-pointer bg-primarybr ">
            <h1>berenay</h1>
            </Link>
                    



                </div>
                <div className='mt-auto'></div>
                <Footer></Footer>
            </div>





        </>
    )
}

export default adminPage