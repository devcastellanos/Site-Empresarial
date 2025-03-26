// components
import { Navbar } from "@/components";
import ProfilePage from "@/components/profileComponents/profilePage";

// sections


export default function Campaign() {
  return (

    <>
      <Navbar />
      <div className="pt-28"> {/* Espacio para que el contenido no quede tapado */}
        <ProfilePage />
      </div>
    </>
      
      


  );
}
