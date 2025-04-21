import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TripsPage = () => {
  return (
    <>
      {/* Navbar */}
      
      <Navbar></Navbar>
      <div className="mx-48">
      {/* Main Content */}
      <h1 className="trip-title text-2xl font-bold text-gray-800 mb-6">
        Trips for <strong>*Destination - *Destination</strong>
      </h1>
     
      {/* Filters Bar */}
      <div className="filters-bar flex justify-between items-center mb-6 p-6 bg-white rounded-xl shadow-lg">
        <button className="filter-button bg-primary text-white py-2 px-6 rounded-full font-bold text-sm hover:bg-primarybr transition-transform duration-300">
          Filters &gt;
        </button>
        <div className="tags flex gap-3 flex-wrap">
          <span className="tag bg-gray-300 py-2 px-6 rounded-full text-sm text-gray-800 hover:bg-primary hover:text-white transition-colors duration-300">
            2+1
          </span>
          <span className="tag bg-gray-300 py-2 px-6 rounded-full text-sm text-gray-800 hover:bg-primary hover:text-white transition-colors duration-300">
            12:00 - 14:00
          </span>
          <span className="tag bg-gray-300 py-2 px-6 rounded-full text-sm text-gray-800 hover:bg-primary hover:text-white transition-colors duration-300">
            0 - 700 ₺
          </span>
        </div>
      </div>
      
      {/* Bus Cards */}
      {[...Array(7)].map((_, index) => (
        <section key={index} className="bus-card bg-white flex items-center justify-between p-6 mb-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
          <Image src="/images/kamilkoc.png" alt="Bus Company Logo" width={100} height={50} />
          <div className="bus-info flex-1 ml-8">
            <div className="seat-info flex items-center justify-center gap-2 mb-1">
              <Image src="/images/seat-icon.png" alt="Seat Icon" width={50} height={50} />
              <span className="text-lg">2+1</span>
            </div>

            <div className="time-price flex justify-between items-center gap-8">
              <div className="time-block">
                <h2 className="text-3xl text-gray-800">12:50</h2>
                <p className="text-sm text-gray-500">7 and half hours</p>
              </div>
            </div>

            <p className="route text-xl font-semibold text-green-900 text-center mt-3 tracking-wide capitalize">
              Ankara - Istanbul
            </p>
          </div>

          <div className="price-container flex flex-col items-center justify-center gap-4 mt-5">
            <button className="seat-btn bg-primary text-white py-3 px-6 rounded-full font-bold hover:bg-primarybr hover:scale-105 transition-transform duration-300">
              Take a Seat
            </button>
            <div className="price text-3xl font-bold text-green-500">
              <strong>600 ₺</strong>
            </div>
          </div>
        </section>
      ))}
      </div>

      <Footer></Footer>


      </>
  );
};

export default TripsPage;
