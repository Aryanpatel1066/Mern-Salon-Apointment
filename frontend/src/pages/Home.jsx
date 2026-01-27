import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
 import Slider from "./Slider";
import useServices from "../hooks/useServices";
import ServiceGrid from "../components/services/ServiceGrid";
import { Link } from "react-router-dom";
function Home() {
  const { services, loading } = useServices({}, 6);

  return (
    <>
      <Navbar />
      <Slider />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Popular Services</h2>

        <ServiceGrid services={services} loading={loading} />

        <div className="text-center mt-8">
          <Link
            to="/services"
            className="text-pink-600 font-medium hover:underline"
          >
            View all services →
          </Link>
        </div>
      </div>

      <FAQ />
      <Footer />
    </>
  );
}
export default Home;
