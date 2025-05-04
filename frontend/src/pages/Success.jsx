import { Link } from "react-router-dom";

function Success() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Booking Successful!</h1>
        <p className="text-gray-700 mb-4">
          You have successfully booked your slot. Please wait for admin approval.
        </p>

        <Link to="/my-bookings">
          <button className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition">
            View Booking →
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Success;
