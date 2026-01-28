import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // ✅ STORE DATA
    localStorage.setItem("selectedServiceId", service._id);
    localStorage.setItem("selectedServicePrice", service.price);

    // ✅ NAVIGATE AFTER STORE
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
        disabled={!service.available}
        onClick={handleBookNow}
        className={`mt-4 w-full py-2 rounded-lg ${
          service.available
            ? "bg-pink-500 text-white hover:bg-pink-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {service.available ? "Book Now" : "Unavailable"}
      </button>
    </div>
  );
};

export default ServiceCard;