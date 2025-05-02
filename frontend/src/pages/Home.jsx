import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ServiceList from "../components/ServiceList";
import Slider from "./Slider";

function Home(){
    return(
        <>
         <Navbar/>
         <Slider/>
         <ServiceList limit={5} />
         <FAQ/>
         <Footer/>
         </>
    )
}
export default Home;