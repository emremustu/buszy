'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation';


const MyTicketsPage = () => {

    const router = useRouter();
    const [userID, setUserId] = useState('');



    useEffect(() => {
        const userLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true' || localStorage.getItem('userLoggedIn') === 'true';
        const rememberMe = localStorage.getItem('rememberMe') === 'true'

        if (!userLoggedIn) {
            router.push('/login');
        }

        if (rememberMe) {
            const userId = localStorage.getItem('userId') ?? "0";
            setUserId(userId);
        }
        
        const data={
            userID
        }
        const fetchTickets = async () =>{
            try{
                const response = await fetch('http://localhost:8000/api/get-tickets', {
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json',
                    },body:JSON.stringify(data)

                })
            }
            catch(error){
                console.log("An error occurred:", error);
            }
        };


    });


    return (
        <>
            <div className='flex flex-col'>
                <Navbar></Navbar>

                <div className='flex flex-col items-center'>
                    <h1 className="text-3xl font-bold mb-5 mt-12">My Tickets</h1>







                </div>



            </div>
        </>
    )
}

export default MyTicketsPage