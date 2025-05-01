import Navbar from "../components/Navbar";
import ServiceList from "./ServiceList";
import Slider from "./Slider";

function Home(){
    return(
        <>
         <Navbar/>
         <Slider/>
         <ServiceList limit={5} />
         </>
    )
}
export default Home;