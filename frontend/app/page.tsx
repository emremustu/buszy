'use client'
import React, { useRef, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ArrowsUpDownIcon } from '@heroicons/react/16/solid';
import DatePicker from "react-datepicker";
import router, { useRouter } from 'next/navigation';

const cities: string[] = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray",
  "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin",
  "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
  "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum",
  "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir",
  "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu",
  "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kocaeli",
  "Konya", "Kütahya", "Malatya", "Manisa", "Mardin",
  "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde",
  "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun",
  "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak",
  "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak",
  "Van", "Yalova", "Yozgat", "Zonguldak"
];

const MainPage = () => {
  const router = useRouter();
  const [origin, setorigin] = useState<string>("");
  const [filteredFromCities, setFilteredFromCities] = useState<string[]>(cities);
  const [fromDropdownOpen, setFromDropdownOpen] = useState<boolean>(false);
  const fromInputRef = useRef<HTMLInputElement | null>(null);
  const fromDropdownRef = useRef<HTMLUListElement | null>(null);

  const [destination, setdestination] = useState<string>("");
  const [filteredToCities, setFilteredToCities] = useState<string[]>(cities);
  const [toDropdownOpen, setToDropdownOpen] = useState<boolean>(false);
  const toInputRef = useRef<HTMLInputElement | null>(null);
  const toDropdownRef = useRef<HTMLUListElement | null>(null);
  const isFocused = false;
  const [date, setDate] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      origin,
      destination,
      date,
    }).toString();

    router.push(`/voyage_listings?${queryParams}`)

  }




  const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setorigin(value);
    setFilteredFromCities(cities.filter(city => city.toLowerCase().includes(value.toLowerCase())));
    setFromDropdownOpen(true);
  };

  const handleSelectorigin = (city: string) => {
    setorigin(city);
    setFromDropdownOpen(false);
  };

  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setdestination(value);
    setFilteredToCities(cities.filter(city => city.toLowerCase().includes(value.toLowerCase())));
    setToDropdownOpen(true);
  };

  const handleSelectdestination = (city: string) => {
    setdestination(city);
    setToDropdownOpen(false);
  };

  useEffect(() => {

      const accountType = localStorage.getItem('account_type') ?? sessionStorage.getItem('account_type');

      if(accountType=='companies'){
        router.push('/administrations');
      }
      

    



    const handleClickOutside = (event: MouseEvent) => {
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target as Node) &&
        fromInputRef.current &&
        !fromInputRef.current.contains(event.target as Node)
      ) {
        setFromDropdownOpen(false);
      }
      if (
        toDropdownRef.current &&
        !toDropdownRef.current.contains(event.target as Node) &&
        toInputRef.current &&
        !toInputRef.current.contains(event.target as Node)
      ) {
        setToDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className="flex flex-col w-full justify-center items-center">
        
        <div className='flex flex-col justify-center items-center shadow-2xl pt-20 pb-20 px-30 rounded-4xl mt-30'>
        <form onSubmit={handleSubmit}>
          <span className='font-semibold text-3xl mb-10'>Where do you want to go?</span>

          <div className='flex flex-row justify-center items-center '>
            {/* From where to where part */}

            <div className="flex flex-col relative w-[28rem]">

              {/* İlk input alanı (From Where?) */}
              <input
                ref={fromInputRef}
                type="text"
                value={origin}
                onChange={handleFromInputChange}
                placeholder="From Where?"
                className="w-full h-14 px-4 py-2   bg-gray-200 placeholder:text-black rounded-4xl focus:outline-none focus:ring-2 focus:ring-primary"
                onFocus={() => setFromDropdownOpen(true)}
              />

              {/* İlk dropdown listesi */}
              {fromDropdownOpen && (
                <ul
                  ref={fromDropdownRef}
                  className="absolute  left-0 mt-14 z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {filteredFromCities.length > 0 ? (
                    filteredFromCities.map((city, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectorigin(city)}
                        className="px-4 py-2 cursor-pointer hover:bg-amber-100"
                      >
                        {city}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">No results found</li>
                  )}
                </ul>
              )}

              {/* İkinci input alanı (To Where?) */}
              <input
                ref={toInputRef}
                type="text"
                value={destination}
                onChange={handleToInputChange}
                placeholder="To Where? "
                className="w-full mt-5 h-14 px-4 py-2 bg-gray-200 placeholder:text-black rounded-4xl  focus:outline-none focus:ring-2 focus:ring-primary"
                onFocus={() => setToDropdownOpen(true)}
              />

              {/* İkinci dropdown listesi (Daha aşağıya kaydırıldı) */}
              {toDropdownOpen && (
                <ul
                  ref={toDropdownRef}
                  className="absolute top-full left-0  z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {filteredToCities.length > 0 ? (
                    filteredToCities.map((city, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectdestination(city)}
                        className="px-4 py-2 cursor-pointer hover:bg-amber-100"
                      >
                        {city}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">No results found</li>
                  )}
                </ul>
              )}
            </div>
            <button
              type="button"
              className="cursor-pointer">
              <ArrowsUpDownIcon className='h-10'></ArrowsUpDownIcon>
            </button>
            {/* Tarih Seçme Alanı */}
            <div className="relative w-40">
              {/* Eğer tarih seçilmediyse "Date" yazısı göster */}
              {!Date && (
                <span className="absolute left-4 top-4 pointer-events-none text-l  text-black font">
                  Date
                </span>
              )}

              {/* Tarih Input Alanı */}
              <div className=' rounded-4xl  bg-gray-200 placeholder:text-black  '>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full h-14 px-4  rounded-4xl text-center  
              focus:outline-none focus:ring-2 focus:ring-primary   appearance-none
              ${date ? "text-black" : "text-transparent"}`} // Tarih seçilmediyse text'i şeffaf yap
                  onFocus={(e) => e.target.showPicker()} // Kullanıcı tıkladığında takvim açılır
                />
              </div>


            </div>




          </div>
          <button className='rounded-full font-sans font-semibold text-white text-2xl bg-primarybr py-2 px-4 mt-10  hover:text-primarybr  hover:bg-white cursor-pointer transition duration-300' >Find Bus!</button>
        </form>
      </div>


      <p className='w-[50rem] my-20 text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu volutpat risus. Donec eu lobortis est, sit amet iaculis ex. Aenean et condimentum felis. In hac habitasse platea dictumst. Donec bibendum sem felis, nec faucibus lectus bibendum quis. Donec quam massa, faucibus eu dignissim at, fringilla vel dolor. In ac fringilla est, a efficitur magna.

        .</p>


    </div >
      <Footer />
    </>
  );
};

export default MainPage;
