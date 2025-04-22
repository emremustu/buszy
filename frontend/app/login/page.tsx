'use client'
import React, { useState } from 'react'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';


const LoginPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [mail,setMail]=useState('');
    const [password,setPassword]=useState('');
    const router = useRouter();
    const[rememberMe,setRememberMe]=useState(false);

    const handleSubmit = async (e:React.FormEvent)=>{
      e.preventDefault();


      const data = {
        email:mail,
        password,
      }
      try {
        const response = await fetch("http://localhost:8000/api/login/",{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify(data),
        });

        const result = await response.json();

        if(result.success){
          if (rememberMe) {
            // Store the user's info (e.g., user_id or token) permanently in localStorage
            localStorage.setItem('rememberMe','true');
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userId', result.user_id); // Assuming result contains user_id
          } else {
            // Store the user's info for the session in sessionStorage
            localStorage.setItem('rememberMe','false');
            sessionStorage.setItem('userLoggedIn', 'true');
            sessionStorage.setItem('userId', result.user_id); // Assuming result contains user_id
          }
          router.push('/');
          
        }
        else{
          alert(result.message || "Bir hata oluştu!"); // Hata mesajını burada göster
        }
      }
      catch (error) {
        console.error("Error during fetch:", error);
        alert("Bir hata oluştu, lütfen tekrar deneyin."+ error);
      }


    };


    return (
      <>
      
  
      <div className='flex flex-col h-screen'>
      <Navbar></Navbar> 
      
        
        <div className="flex flex-col items-center h-full justify-center">
          
          <h1 className="text-3xl font-bold mb-5 text-primary mt-12">Login</h1>
          <form onSubmit={handleSubmit} className="w-[48rem] bg-white shadow-2xl rounded-3xl p-8 grid grid-cols-2 gap-6">
            <div className="mb-6 col-span-2">
              <label htmlFor="email" className="block text-lg font-medium mb-2">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                placeholder="Type your email"
                value={mail}
                onChange={(e)=>setMail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            
            <div className=" col-span-2 relative ">
              <label htmlFor="password" className="block text-lg font-medium ">
                Password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Type your password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}

                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
              >
                {passwordVisible ?  <EyeIcon className="h-6 w-6" />  : <EyeSlashIcon className="h-6 w-6" /> }
              </button>
            </div>
            
            <div className="mb-1 col-span-2">
              
  
            <div className="form-control flex flex-row">
                
                  <label className="label cursor-pointer">
                    
                    <input type="checkbox"  className="checkbox checkbox-primary h-4 w-4" checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)} />
                    <span className="label-text font-sans text-sm ml-2">Remember me</span>
                  </label>
                </div>
                
            </div>
  
           
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primarybr cursor-pointer transition duration-300"
  
              >
                Signup
              </button>
            </div>
          </form>
        </div>
  
        
        
        
        -
      
        <div className='mt-auto'></div>
        <Footer></Footer>
  </div>
  
      
        
      </>
      )
}

export default LoginPage