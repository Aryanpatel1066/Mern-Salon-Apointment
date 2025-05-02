const Footer = () => {
    return (
      <footer className="bg-white text-gray-600 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-pink-600">Salon Bliss</h2>
            <p className="text-sm">Where style meets comfort & care.</p>
          </div>
  
          <div className="text-sm text-center md:text-right space-y-1">
            <p>📍 123 Elegance Lane, City Center</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ contact@salonbliss.com</p>
          </div>
        </div>
  
        <div className="mt-6 pt-4 text-center text-xs text-gray-400 border-t border-gray-100">
          &copy; {new Date().getFullYear()} <span className="text-pink-500 font-medium">Salon Bliss</span>. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  