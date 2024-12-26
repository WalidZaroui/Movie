import NavbarComponent from "../components/NavbarComponent";
import ImageCarousel from "../components/ImageCarousel";
import FooterComponent from "../components/FooterComponent";

function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <NavbarComponent />
      <div className="flex-grow py-9">
        <ImageCarousel />
      </div>
      <FooterComponent />
    </div>
  );
}

export default Home;