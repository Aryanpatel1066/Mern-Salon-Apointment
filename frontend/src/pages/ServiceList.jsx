import React, { useEffect, useState } from 'react';
 import { Link } from 'react-router-dom';
import api from '../api/api';
const ServiceList = ({ limit = 5 }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Popular Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.slice(0, limit).map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              {service.available ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Available</span>
              ) : (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Unavailable</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
            <p className="text-pink-600 font-bold mb-1">₹{service.price}</p>
            <p className="text-xs text-gray-500 mb-4">Duration: {service.duration}</p>
            <button className="bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-pink-600 transition">
              Book Now
            </button>
          </div>
        ))}
      </div>

      {services.length > limit && (
        <div className="text-center mt-6">
          <Link
            to="/services"
            className="text-pink-600 hover:underline font-medium"
          >
            View All Services →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
