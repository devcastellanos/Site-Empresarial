// components
import { NavbarRH } from "@/components";
import ProfilePage from "@/components/profileComponents/sideBarProfile";

// sections


export default function Campaign() {
  return (

    <>
      <NavbarRH />
      <div className="pt-28"> {/* Espacio para que el contenido no quede tapado */}
        <ProfilePage />
      </div>
    </>
      
      


  );
}
