import { Mail, MapPin, Phone } from 'lucide-react'; // optional icons lib

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 pt-10 border-t border-pink-100">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        
        {/* Brand Section */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-pink-600">Salon Bliss</h2>
          <p className="text-sm mt-1 text-gray-500">Where style meets comfort & care.</p>
        </div>

        {/* Contact Info */}
        <div className="text-sm space-y-2 text-center md:text-right">
          <div className="flex items-center justify-center md:justify-end gap-2">
            <MapPin className="w-4 h-4 text-pink-500" />
            <p>123 Elegance Lane, City Center</p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-2">
            <Phone className="w-4 h-4 text-pink-500" />
            <p>+91 98765 43210</p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-2">
            <Mail className="w-4 h-4 text-pink-500" />
            <p>contact@salonbliss.com</p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 py-4 text-center text-xs text-gray-400 border-t border-gray-200">
        &copy; {new Date().getFullYear()} <span className="text-pink-600 font-semibold">Salon Bliss</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
