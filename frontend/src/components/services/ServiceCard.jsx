import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const [canBook, setCanBook] = useState(true);
  const [loading, setLoading] = useState(true);

  // ✅ CHECK DAILY BOOKING LIMIT
useEffect(() => {
  const fetchBookingStatus = async () => {
    try {
      const res = await api.get("/booking/status");
      setCanBook(res.data.canBook);
    } catch (error) {
      // fallback: allow booking if API fails
      setCanBook(true);
    } finally {
      setLoading(false);
    }
  };

  fetchBookingStatus();
}, []);


  // ✅ DEFINE IT HERE (IMPORTANT)
  const isDisabled = !service.available || !canBook || loading;

  const handleBookNow = () => {
    if (!service.available) {
      toast.error("This service is unavailable");
      return;
    }

    if (!canBook) {
      toast.error("You reached today's booking limit");
      return;
    }

    localStorage.setItem("selectedServiceId", service._id);
    localStorage.setItem("selectedServicePrice", service.price);

    navigate("/booking");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-5 border">
      <h3 className="font-bold text-lg">{service.name}</h3>

      {service.description && (
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {service.description}
        </p>
      )}

      <div className="mt-4 flex justify-between">
        <span className="font-bold text-pink-600">₹{service.price}</span>
        <span className="text-sm">{service.duration} mins</span>
      </div>

      <button
        disabled={isDisabled}
        onClick={handleBookNow}
        className={`mt-4 w-full py-2 rounded-lg ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-pink-500 text-white hover:bg-pink-600"
        }`}
      >
        {loading
          ? "Checking..."
          : !service.available
          ? "Unavailable"
          : !canBook
          ? "Daily limit reached"
          : "Book Now"}
      </button>
    </div>
  );
};

export default ServiceCard;
