// components
import { Navbar, Footer, BlogPostCard } from "@/components";

// sections
import Hero from "../hero";
import Posts from "../posts";
import Articles from "../articles";

import ExcelUploader from "../cargaMasiva";


export default function Campaign() {
  return (
    <>
      <Navbar />

      <ExcelUploader />
    </>

  );
}
