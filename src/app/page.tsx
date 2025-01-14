// components
import { Navbar, Footer, BlogPostCard } from "@/components";

// sections
import Hero from "./hero";
import Posts from "./posts";
import Articles from "./articles";
import Prueba from "./post";


export default function Campaign() {
  return (
    <>
      <Navbar />
      <Hero />
      <Posts />
      <Articles />
      <Footer />
      <Prueba />

    </>
   

  );
}
