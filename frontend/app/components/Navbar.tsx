import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <div className='flex flex-row items-center bg-primary'>
            <Link href='/'>
                <img src='/assets/images/buszy_logo.png' alt="Marpus'a Hoşgeldiniz!" className='h-24 ml-8' />
            </Link>

            <Link href='/' className='ml-auto '>
                <button className='rounded-full font-sans font-semibold text-white text-2xl py-2 px-4 mr-4 hover:text-primarybr cursor-pointer transition duration-300' >Login</button>

            </Link>
            <Link href='/signup' className=' '>
                <button className='rounded-full font-sans font-semibold text-white text-2xl bg-primarybr py-2 px-4 mr-8  hover:text-primarybr  hover:bg-white cursor-pointer transition duration-300' >Signup</button>

            </Link>
        </div>
    )
}

export default Navbar