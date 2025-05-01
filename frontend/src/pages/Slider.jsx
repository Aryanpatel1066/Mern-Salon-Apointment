import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Slider.css';  

const SalonSlider = () => {
  return (
    <div className="slider-container">
      <Carousel autoPlay infiniteLoop showThumbs={false}>
        <div>
          <img src="/images/img2.jpg" alt="Salon Interior" />
        </div>
        <div>
          <img src="/images/img3.jpg" alt="Face Massage" />
        </div>
        <div>
          <img src="/images/img4.jpg" alt="Barber Facial" />
        </div>
        <div>
          <img src="/images/img1.jpg" alt="Salon Tools" />
        </div>
      </Carousel>
    </div>
  );
};

export default SalonSlider;
