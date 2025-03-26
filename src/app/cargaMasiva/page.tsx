// components
import { Navbar, Footer, BlogPostCard } from "@/components";

// sections
import Hero from "../hero";
import Posts from "../../components/blogComponents/postsPage";
import Articles from "../articles";

import ExcelUploader from "../excelUploader"


export default function Campaign() {
  return (
    <>
      <Navbar />

      <ExcelUploader />
    </>

  );
}
