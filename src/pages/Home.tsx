import Banner from "../components/Banner";
import Footer from "../components/Footer";
import CarouselSize from "../components/carousel";

export function Home() {
  return (
    <>
      <Banner />
      <div className="py-11">
        <h3 className="font-karla text-center">Camisas</h3>
        <CarouselSize category="Camisa" />
      </div>
      <div className="py-11">
        <h3 className="font-karla text-center">Pantalones</h3>
        <CarouselSize category="Pantalon" />
      </div>
      <div className="py-11">
        <h3 className="font-karla text-center">Prendas de seda</h3>
        <CarouselSize material="seda" />
      </div>
      <div className="py-11">
        <h3 className="font-karla text-center">Prendas de poliester</h3>
        <CarouselSize material="poliester" />
      </div>
      <div className="py-11">
        <h3 className="font-karla text-center">Prendas de algodon</h3>
        <CarouselSize material="algodon" />
      </div>
      <Footer />
    </>
  );
}
