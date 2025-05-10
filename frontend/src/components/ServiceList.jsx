import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/api';

const ServiceList = ({ limit = 5 }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        
        setServices(res.data);
        console.log(res.data)
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Popular Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.slice(0, limit).map((service, index) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  service.available
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {service.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
            <p className="text-pink-600 font-bold mb-1">₹{service.price}</p>
            <p className="text-xs text-gray-500 mb-4">Duration: {service.duration} mins</p>
            {service.available && (
  <Link to="/booking">
    <button
      onClick={() => {
        localStorage.setItem('selectedServiceId', service._id);
        localStorage.setItem('selectedServicePrice', service.price);
      }}
      className="bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-pink-600 transition"
    >
      Book Now
    </button>
  </Link>
)}

          </motion.div>
        ))}
      </div>

      {services.length > limit && (
        <div className="text-center mt-8">
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
