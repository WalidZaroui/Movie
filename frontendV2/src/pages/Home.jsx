import NavbarComponent from "../components/NavbarComponent";
import  ImageCarousel from "../components/ImageCarousel";
function Home() {
  return (
    <>
      <div className="bg-black min-h-screen space-y-14">
        <div>
          <NavbarComponent />
        </div>
        <div className="py-9"> 
        <ImageCarousel></ImageCarousel>
        </div>
      </div>
    </>
  );
}
export default Home;
