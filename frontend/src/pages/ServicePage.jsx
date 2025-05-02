import Navbar from '../components/Navbar';
import ServiceList from '../components/ServiceList';

const ServicesPage = () => {
  return (
    <div>
      <Navbar/>
      <ServiceList limit={999} />
    </div>
  );
};

export default ServicesPage;
