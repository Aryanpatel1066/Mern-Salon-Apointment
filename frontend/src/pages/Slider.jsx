import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const SalonSlider = () => {
  const slides = [
    { src: "/images/img2.jpg", alt: "Salon Interior", text: "Relax in Our Modern Salon" },
    { src: "/images/img3.jpg", alt: "Face Massage", text: "Rejuvenating Face Treatments" },
    { src: "/images/img4.jpg", alt: "Barber Facial", text: "Professional Barber Services" },
    { src: "/images/img1.jpg", alt: "Salon Tools", text: "Top-Quality Tools & Hygiene" },
  ];

  return (
    <div className="max-w-screen-xl mx-auto mt-6 rounded-2xl overflow-hidden shadow-lg">
      <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <img src={slide.src} alt={slide.alt} className="object-cover w-full h-[450px]" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h2 className="text-white text-3xl md:text-5xl font-bold text-center px-4">
                {slide.text}
              </h2>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default SalonSlider;
